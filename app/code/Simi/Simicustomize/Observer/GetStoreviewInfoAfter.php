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

        $confArray['footer_config'] = $this->getFooterConfig();

        $obj->configArray = $confArray;
    }


    private function getStoreConfig($path)
    {
        return $this->appScopeConfigInterface
            ->getValue($path, \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $this->storeManager->getStore()->getCode());
    }

    private function isSerialized( $value ) {
		return (boolean) preg_match( '/^((s|i|d|b|a|O|C):|N;)/', $value );
    }

    public function getSerializedConfigValue( $value ) {
		if ( empty( $value ) ) {
			return false;
		}
		if ( $this->isSerialized( $value ) ) {
			$unserializer = $this->simiObjectManager->get( \Magento\Framework\Unserialize\Unserialize::class );
		} else {
			$unserializer = $this->simiObjectManager->get( \Magento\Framework\Serialize\Serializer\Json::class );
		}

		return $unserializer->unserialize( $value );
	}


    public function getFooterConfig() {
		$facebookLink  = $this->getStoreConfig( 'siminiaconfig/footer/facebook_link' );
		$instagramLink = $this->getStoreConfig( 'siminiaconfig/footer/instagram_link' );
		$youtubeLink   = $this->getStoreConfig( 'siminiaconfig/footer/youtube_link' );
        $menuTitle1    = $this->getStoreConfig( 'siminiaconfig/footer/footer_1_title' );
		$menusListing1 = $this->getStoreConfig( 'siminiaconfig/footer/footer_1_menu' );
        $menuTitle2    = $this->getStoreConfig( 'siminiaconfig/footer/footer_2_title' );
		$menusListing2 = $this->getStoreConfig( 'siminiaconfig/footer/footer_2_menu' );
		
        $menus1        = [];
		$list         = $this->getSerializedConfigValue( $menusListing1 );
		if ( $list && count( $list ) > 0 ) {
			foreach ( $list as $key => $item ) {
				$menus1[] = $item;
			}
		}

        $menus2       = [];
		$list         = $this->getSerializedConfigValue( $menusListing2 );
		if ( $list && count( $list ) > 0 ) {
			foreach ( $list as $key => $item ) {
				$menus2[] = $item;
			}
		}

		return [
			'facebook_link'  => $facebookLink,
			'instagram_link' => $instagramLink,
			'youtube_link'   => $youtubeLink,
            'menu_title_1'   => $menuTitle1,
            'menu_title_2'   => $menuTitle2,
			'menus_1'        => $menus1,
            'menus_2'        => $menus2,
		];
	}
}