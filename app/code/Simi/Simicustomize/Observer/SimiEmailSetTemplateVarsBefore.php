<?php

namespace Simi\Simicustomize\Observer;

use Magento\Framework\Event\ObserverInterface;

class SimiEmailSetTemplateVarsBefore implements ObserverInterface {
    public $simiObjectManager;

    public $helperData;

    public $storeManager;

    public function __construct(
        \Magento\Framework\ObjectManagerInterface $simiObjectManager,
        \Simi\Simicustomize\Helper\Data $helperData,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        $this->helperData = $helperData;
        $this->simiObjectManager = $simiObjectManager;
    }

	public function execute(\Magento\Framework\Event\Observer $observer) {
		$transport = $observer->getData('transportObject');
        
        $pwaUrl = $this->helperData->getPwaUrl();
        if(!$pwaUrl) {
            $pwaUrl = $this->_storeManager->getStore()->getBaseUrl();
        }

        $transport->setData('pwa_url', $pwaUrl);

        $observer->setData('transportObject', $transport);
	}
}