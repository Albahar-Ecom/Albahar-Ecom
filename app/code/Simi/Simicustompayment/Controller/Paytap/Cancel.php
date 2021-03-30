<?php

namespace Simi\Simicustompayment\Controller\Paytap;

class Cancel extends \Gateway\Tap\Controller\Tap
{

    public function execute()
    {
        $this->_cancelPayment();
        $this->_checkoutSession->restoreQuote();

        $helper = $this->_objectManager->get('Simi\Simiconnector\Helper\Data');
        
        if ($helper->getStoreConfig('simiconnector/general/pwa_studio_url')) {
            $redirectUrl = $helper->getStoreConfig('simiconnector/general/pwa_studio_url').'checkout.html';
        } else {
            $redirectUrl = $this->getTapHelper()->getUrl('checkout.html');
        }

        $this->getResponse()->setRedirect($redirectUrl);
    }

}
