<?php

namespace Gateway\Tap\Controller\Standard;

class Response extends \Gateway\Tap\Controller\Tap
{
    /**
     * @var OrderManagementInterface
     */
    protected $orderManagement;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Sales\Api\OrderManagementInterface $orderManagement,
        \Psr\Log\LoggerInterface $logger
    ) {
        $this->orderManagement = $orderManagement;
        $this->logger = $logger;
        parent::__construct($context);
    }

    public function execute()
    {
		$orderId	=	$_REQUEST['trackid'];
		$order 		=	$this->getOrderById($orderId);
		$comment 	= 	"";
		$successFlag= 	false;
		
        if(isset($_REQUEST['result']))
        {
			if($_REQUEST['result']=='SUCCESS')
			{
				$params = $this->getRequest()->getParams();			
				if($this->getTapModel()->validateResponse($params))
				{
					$successFlag = true;
					$comment .=  '<br/><b>Tap payment successful</b><br/><br/>Tap ID - '.$_REQUEST['ref'].'<br/><br/>Order ID - '.$_REQUEST['trackid'].'<br/><br/>Payment Type - '.$_REQUEST['crdtype'].'<br/><br/>Payment ID - '.$_REQUEST['payid'];
					$order->setStatus($order::STATE_PROCESSING);
					$order->setExtOrderId($orderId);
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
		$this->addOrderHistory($order,$comment);
        $order->save();
		if($successFlag)
		{
			$this->messageManager->addSuccess( __('Tap transaction has been successful.') );
            if ($order) {
                try {
                    $this->orderManagement->notify($order->getEntityId());
                } catch (\Magento\Framework\Exception\LocalizedException $e) {
                    $this->messageManager->addError($e->getMessage());
                } catch (\Exception $e) {
                    $this->messageManager->addError(__('We can\'t send the email order right now.'));
                    $this->logger->critical($e);
                }
            }
		}
		else
		{
			$this->messageManager->addError( __($errorMsg) );
		}
        $this->getResponse()->setRedirect($returnUrl);
    }
}
