<?php

namespace Simi\Simicustomize\Observer;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Event\ObserverInterface;

class GetStoreviewInfoAfter implements ObserverInterface
{

    public $storeManager;
    public $simiObjectManager;
    public $appScopeConfigInterface;

    public function __construct(
        \Magento\Framework\ObjectManagerInterface $simiObjectManager,
        ScopeConfigInterface $appScopeConfigInterface,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    )
    {
        $this->simiObjectManager = $simiObjectManager;
        $this->storeManager = $storeManager;
        $this->appScopeConfigInterface = $appScopeConfigInterface;
    }

    /**
     * @param \Magento\Framework\Event\Observer $observer
     * @return $this
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $obj = $observer->getObject();
        $confArray = $obj->configArray;
        $confArray['facebook_config'] = array(
            'app_id' => $this->getStoreConfig('siminiaconfig/facebook/app_id'),
        );

        $confArray['google_config'] = array(
            'login_client_id' => $this->getStoreConfig('siminiaconfig/google/login_client_id'),
        );
        $obj->configArray = $confArray;
    }


    private function getStoreConfig($path)
    {
        return $this->appScopeConfigInterface
            ->getValue($path, \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $this->storeManager->getStore()->getCode());
    }

}