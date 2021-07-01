<?php
/**
 * Copyright © 2016 Simi. All rights reserved.
 */
namespace Simi\Simicustomize\Observer;

use Magento\Framework\Event\ObserverInterface;

class SalesOrderSaveAfter implements ObserverInterface {
    protected $orderSender;
    public function __construct(
        \Magento\Sales\Api\OrderManagementInterface $orderManagement,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->orderManagement = $orderManagement;
        $this->logger = $logger;
    }
    public function execute(\Magento\Framework\Event\Observer $observer) {
        return; // do not use this event cause bug

        $order = $observer->getOrder();
        if (
            $order->getPayment()->getMethodInstance()->getCode() == 'tap' 
            && $order->getEntityId() 
            && $order->getStatus() == \Magento\Sales\Model\Order::STATE_PROCESSING
        ) {
            try {
                $this->orderManagement->notify($order->getEntityId());
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->logger->critical($e->getMessage());
            } catch (\Exception $e) {
                $this->logger->critical($e);
            }
        }
    }
}