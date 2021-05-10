<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Simi\Simicustomize\Model;

use Magento\Payment\Helper\Data as PaymentHelper;
use Magento\Sales\Model\Order;
use Magento\Sales\Model\Order\Email\Container\OrderIdentity;
use Magento\Sales\Model\Order\Email\Container\Template;
use Magento\Sales\Model\Order\Email\Sender;
use Magento\Sales\Model\ResourceModel\Order as OrderResource;
use Magento\Sales\Model\Order\Address\Renderer;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\DataObject;
use Magento\Framework\Mail\Template\TransportBuilder;

/**
 * Class OrderSender
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class OrderSender extends \Magento\Sales\Model\Order\Email\Sender\OrderSender
{
    const XML_PATH_EMAIL_SHIPPING_DEPARTMENT = 'sales_email/order/shipper_email';
    const XML_PATH_EMAIL_SHIPPING_DEPARTMENT_NAME = 'sales_email/order/shipper_name';
    // const XML_PATH_EMAIL_GUEST_SHIPPER_TEMPLATE = 'sales_email/order/shipper_guest_template';
    const XML_PATH_EMAIL_SHIPPER_TEMPLATE = 'sales_email/order/template_departm';

    protected $config;
    protected $transportBuilder;

    /**
     * @param Template $templateContainer
     * @param OrderIdentity $identityContainer
     * @param Order\Email\SenderBuilderFactory $senderBuilderFactory
     * @param \Psr\Log\LoggerInterface $logger
     * @param Renderer $addressRenderer
     * @param PaymentHelper $paymentHelper
     * @param OrderResource $orderResource
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $globalConfig
     * @param ManagerInterface $eventManager
     */
    public function __construct(
        Template $templateContainer,
        OrderIdentity $identityContainer,
        \Magento\Sales\Model\Order\Email\SenderBuilderFactory $senderBuilderFactory,
        \Psr\Log\LoggerInterface $logger,
        Renderer $addressRenderer,
        PaymentHelper $paymentHelper,
        OrderResource $orderResource,
        \Magento\Framework\App\Config\ScopeConfigInterface $globalConfig,
        ManagerInterface $eventManager,
        \Magento\Framework\App\Config $config,
        TransportBuilder $transportBuilder
    ) {
        $this->config = $config;
        $this->transportBuilder = $transportBuilder;

        parent::__construct(
            $templateContainer,
            $identityContainer,
            $senderBuilderFactory,
            $logger,
            $addressRenderer,
            $paymentHelper,
            $orderResource,
            $globalConfig,
            $eventManager
        );
    }

    /**
     * Sends order email to the customer.
     *
     * Email will be sent immediately in two cases:
     *
     * - if asynchronous email sending is disabled in global settings
     * - if $forceSyncMode parameter is set to TRUE
     *
     * Otherwise, email will be sent later during running of
     * corresponding cron job.
     *
     * @param Order $order
     * @param bool $forceSyncMode
     * @return bool
     */
    public function send(Order $order, $forceSyncMode = false)
    {
        $this->prepareTemplate($order);
        $this->configureEmailTemplate();
        $this->transportBuilder->addTo(
            $this->config->getValue(self::XML_PATH_EMAIL_SHIPPING_DEPARTMENT),
            $this->config->getValue(self::XML_PATH_EMAIL_SHIPPING_DEPARTMENT_NAME)
        );
        $transport = $this->transportBuilder->getTransport();
        $transport->sendMessage();
    }

    /**
     * Configure email template
     *
     * @return void
     */
    protected function configureEmailTemplate()
    {
        $this->transportBuilder->setTemplateIdentifier($this->templateContainer->getTemplateId());
        $this->transportBuilder->setTemplateOptions($this->templateContainer->getTemplateOptions());
        $this->transportBuilder->setTemplateVars($this->templateContainer->getTemplateVars());
        $this->transportBuilder->setFromByScope(
            $this->identityContainer->getEmailIdentity(),
            $this->identityContainer->getStore()->getId()
        );
    }

    /**
     * Prepare email template with variables
     *
     * @param Order $order
     * @return void
     */
    protected function prepareTemplate(Order $order)
    {
        $transport = [
            'order' => $order,
            'billing' => $order->getBillingAddress(),
            'payment_html' => $this->getPaymentHtml($order),
            'store' => $order->getStore(),
            'formattedShippingAddress' => $this->getFormattedShippingAddress($order),
            'formattedBillingAddress' => $this->getFormattedBillingAddress($order),
            'created_at_formatted' => $order->getCreatedAtFormatted(2),
            'order_data' => [
                'customer_name' => $order->getCustomerName(),
                'customer_email' => $order->getCustomerEmail(),
                'is_not_virtual' => $order->getIsNotVirtual(),
                'email_customer_note' => $order->getEmailCustomerNote(),
                'frontend_status_label' => $order->getFrontendStatusLabel()
            ]
        ];
        $transportObject = new DataObject($transport);

        /**
         * Event argument `transport` is @deprecated. Use `transportObject` instead.
         */
        $this->eventManager->dispatch(
            'email_order_set_template_vars_before',
            ['sender' => $this, 'transport' => $transportObject, 'transportObject' => $transportObject]
        );

        $this->templateContainer->setTemplateVars($transportObject->getData());

        parent::prepareTemplate($order);

        // if ($order->getCustomerIsGuest()) {
        //     $templateId = $this->getShipperGuestTemplateId();
        // } else {
            $templateId = $this->getShipperTemplateId();
        // }
        if ($templateId) {
            $this->templateContainer->setTemplateId($templateId);
        }
    }

    /**
     * Return guest template id
     *
     * @return mixed
     */
    // public function getShipperGuestTemplateId()
    // {
    //     return $this->config->getValue(self::XML_PATH_EMAIL_GUEST_SHIPPER_TEMPLATE);
    // }

    /**
     * Return template id
     *
     * @return mixed
     */
    public function getShipperTemplateId()
    {
        return $this->config->getValue(self::XML_PATH_EMAIL_SHIPPER_TEMPLATE);
    }
}
