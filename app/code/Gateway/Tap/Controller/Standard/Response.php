<?php

namespace Gateway\Tap\Controller\Standard;

class Response extends \Gateway\Tap\Controller\Tap
{
    public function execute()
    {
		$orderId	=	$_REQUEST['trackid'] ?? '';
		$order 		=	$this->getOrderById($orderId);
		$comment 	= 	"";
		$successFlag= 	false;
		$stopAddHistory = false;

        if(isset($_REQUEST['result']))
        {
			if($_REQUEST['result']=='SUCCESS')
			{
				$params = $this->getRequest()->getParams();			
				if($this->getTapModel()->validateResponse($params))
				{
					$successFlag = true;
					$comment .=  '<br/><b>Tap payment successful</b><br/><br/>Tap ID - '.$_REQUEST['ref'].'<br/><br/>Order ID - '.$_REQUEST['trackid'].'<br/><br/>Payment Type - '.$_REQUEST['crdtype'].'<br/><br/>Payment ID - '.$_REQUEST['payid'];
					// $order->setStatus($order::STATE_PROCESSING);
					// $order->setExtOrderId($orderId);
					// fix bug paytap no invoiced
					if ($order->getStatus() != $order::STATE_PROCESSING) {
						$order->setStatus($order::STATE_PROCESSING);
						$order->setState($order::STATE_PROCESSING);
						$order->setExtOrderId($orderId);
						try {
							if ($order->canInvoice()) {
								$invoice = $order->prepareInvoice();
								$invoice->addComment($comment, false, false);
								$invoice->setCustomerNote('');
								$invoice->setCustomerNoteNotify(false);
								$invoice->setRequestedCaptureCase(\Magento\Sales\Model\Order\Invoice::CAPTURE_ONLINE);
								$invoice->register();
								// $invoice->pay();
								$invoice->setState($invoice::STATE_PAID);

								// Add total paid to order (fix bug order closed)
								$order->setTotalPaid($invoice->getGrandTotal());
								$order->setBaseTotalPaid($invoice->getBaseGrandTotal());

								$payment = $order->getPayment();
								$transaction = $payment->addTransaction(\Magento\Sales\Model\Order\Payment\Transaction::TYPE_CAPTURE, null, true);
								$invoice->setTransactionId($_REQUEST['ref']);
								$invoice->save();
								$payment->setTransactionId($_REQUEST['ref']);
								$payment->setParentTransactionId($payment->getTransactionId());
								if ($transaction) {
									$transaction->setIsClosed(true);
									$transaction->save();
								}

								$transactionSave = $this->_objectManager->create(
									\Magento\Framework\DB\Transaction::class
								)->addObject(
									$invoice
								);
								$transactionSave->save();
								$salesData = $this->_objectManager->create(\Magento\Sales\Helper\Data::class);
								if ($salesData->canSendNewInvoiceEmail()) {
									$invoiceSender = $this->_objectManager->create(
										\Magento\Sales\Model\Order\Email\Sender\InvoiceSender::class
									);
									$invoiceSender->send($invoice);
								}
							}
						} catch (\Exception $e) {
							$comment .=  '<br/>Error when creating invoice: '.$e->getMessage();
						}
					} else {
						$stopAddHistory = true;
					}
					// end fix bug

					$returnUrl = $this->getTapHelper()->getUrl('checkout/onepage/success');
				}
				else
				{
					$errorMsg = 'It seems some issue in server to server communication. Kindly connect with administrator.';
					$comment .=  '<br/>Hash string Mismatch / Fraud Deducted<br/><br/>Tap ID - '.$_REQUEST['ref'].'<br/><br/>Order ID - '.$_REQUEST['trackid'];
					$order->setStatus($order::STATE_PAYMENT_REVIEW);
					$returnUrl = $this->getTapHelper()->getUrl('checkout/onepage/failure');
				}
			}
			else
			{
				if($_REQUEST['result']=='FAILURE' || $_REQUEST['result']=='CANCELLED')
				{
					$errorMsg = 'Tap Transaction Failed ! Transaction was cancelled.';
					$comment .=  "Payment cancelled by user";
					$order->setStatus($order::STATE_CANCELED);
					$this->_cancelPayment("Payment cancelled by user");
					//$order->save();
					$returnUrl = $this->getTapHelper()->getUrl('checkout/cart');
				}
				else
				{
					$errorMsg = 'Tap Transaction Failed !';
					$comment .=  "Failed";
					$order->setStatus($order::STATE_PAYMENT_REVIEW);
					$returnUrl = $this->getTapHelper()->getUrl('checkout/onepage/failure');
				}
			}            
        }
        else
        {
			$errorMsg = 'Tap Transaction Failed ! Fraud has been detected';
			$comment .=  "Fraud Deducted";
            $order->setStatus($order::STATUS_FRAUD);
            $returnUrl = $this->getTapHelper()->getUrl('checkout/onepage/failure');
        }
        if ($order && $order->getId() && !$stopAddHistory) {
			$this->addOrderHistory($order,$comment);
        	$order->save();
        }
		if($successFlag)
		{
			$this->messageManager->addSuccess( __('Tap transaction has been successful.') );
		}
		else
		{
			$this->messageManager->addError( __($errorMsg) );
		}
        $this->getResponse()->setRedirect($returnUrl);
    }

}
