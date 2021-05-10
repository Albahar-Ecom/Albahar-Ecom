<?php
/**
 * Copyright © 2016 Simi. All rights reserved.
 */
namespace Simi\Simicustomize\Observer;

use Magento\Framework\Event\ObserverInterface;

class SalesOrderSaveAfter implements ObserverInterface {
    protected $orderSender;
    public function __construct(
        \Simi\Simicustomize\Model\OrderSender $orderSender
    ) {
        $this->orderSender = $orderSender;
    }
    public function execute(\Magento\Framework\Event\Observer $observer) {
        $order = $observer->getOrder();
        if (
            $order->getPayment()->getMethodInstance()->getCode() == 'tap' 
            && $order->getEntityId() 
            && $order->getStatus() == \Magento\Sales\Model\Order::STATE_PROCESSING
        ) {
            try{
                // $orderEmailSender = $this->orderEmailSenderFactory->create([
                //     'templateContainer' => $this->emailContainerTemplate,
                //     'identityContainer' => $this->emailContainerShipmentIdentity,
                // ]);
                // $orderEmailSender->send($order);
                $this->orderSender->send($order);
            }catch(\Exception $e){
                
            }
        }
    }
}