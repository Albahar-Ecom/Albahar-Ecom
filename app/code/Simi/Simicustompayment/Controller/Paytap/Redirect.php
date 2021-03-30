<?php

namespace Simi\Simicustompayment\Controller\Paytap;

class Redirect extends \Gateway\Tap\Controller\Tap
{
    public function execute()
    {
        $order = $this->getOrder();
        $paramOrderId = $this->getRequest()->getParam('order_id');
        if ((!$order || !$order->getId()) && $paramOrderId) {
            $order = $this->getOrderById($paramOrderId);
        }
        if ($order->getBillingAddress())
        {
			$this->addOrderHistory($order,'<br/>The customer was redirected to Tap');
			$buildResultHtml = $this->getTapModel()->buildTapRequest($order);

            /* replace <input type='hidden' name='ReturnURL' value='https://...'/> // _secure=true */
            $returnUrl = $this->getTapHelper()->getUrl('simicustompayment/paytap/response', ['_secure' => true]);
            $buildResultHtml = preg_replace(
                "/<input type='hidden' name='ReturnURL' value='http.*?'\/>/", 
                "<input type='hidden' name='ReturnURL' value='".$returnUrl."'/>", 
                $buildResultHtml
            );
            $buildResultHtml = preg_replace(
                '/<input type="hidden" name="ReturnURL" value="http.*?"\/>/', 
                "<input type='hidden' name='ReturnURL' value='".$returnUrl."'/>", 
                $buildResultHtml
            );
            
            echo $buildResultHtml;
            /*$this->getResponse()->setRedirect(
                $this->getTapModel()->buildTapRequest($order)
            );*/
        }
        else
        {
            $this->_cancelPayment();
            $this->_tapSession->restoreQuote();
            
            $helper = $this->_objectManager->get('Simi\Simiconnector\Helper\Data');
            if ($helper->getStoreConfig('simiconnector/general/pwa_studio_url')) {
                $redirectUrl = $helper->getStoreConfig('simiconnector/general/pwa_studio_url').'checkout.html';
            } else {
                $redirectUrl = $this->getTapHelper()->getUrl('checkout.html');
            }
            $this->getResponse()->setRedirect($redirectUrl);
        }
    }
}