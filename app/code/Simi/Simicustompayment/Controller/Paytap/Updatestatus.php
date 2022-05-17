<?php

namespace Simi\Simicustompayment\Controller\Paytap;

class Updatestatus extends \Gateway\Tap\Controller\Tap
{
    public function execute()
    {
		$orders = $this->getRequest()->getParam('ids');
		$orders = explode(',', $orders);

		echo '<pre>';
        // Fix bug paytap: update order status closed -> complete
		foreach($orders as $orderIncId){
			$order = $this->getOrderById($orderIncId);
			if ($order->getId() 
				&& $order->getStatus() == $order::STATE_CLOSED 
				&& $order->getPayment()->getMethodInstance()->getCode() == 'tap')
			{
				$order->setIsCustomerNotified(true);
				$order->setStatus($order::STATE_COMPLETE);
				$order->setState($order::STATE_COMPLETE);
				try {
					echo "order: \n";
					var_dump($order->getId());
					// $invoices = $order->getInvoiceCollection();
					$invoices = $this->_objectManager->create('Magento\Sales\Model\ResourceModel\Order\Invoice\Collection');
					$invoices->addFieldToFilter('order_id', $order->getId());
					if ($invoices->getSize()) {
						$grandTotal = 0;
						$baseGrandTotal = 0;
						foreach($invoices as $invoice){
							var_dump('Invoice: '.$invoice->getId());
							$grandTotal += $invoice->getGrandTotal();
							$baseGrandTotal += $invoice->getBaseGrandTotal();
						}
						// Add total paid to order (fix bug order closed)
						$order->setBaseTotalPaid($baseGrandTotal);
						$order->setTotalPaid($grandTotal);
						
						$transactionSave = $this->_objectManager->create(
							\Magento\Framework\DB\Transaction::class
						)->addObject(
							$order
						);
						$transactionSave->save();
					}
				} catch (\Exception $e) {
					var_dump($e->getMessage());
				}
			} else {
				echo "This order not found: $orderIncId\n";
			}
		}
		echo 'success';
		die;
    }
}
