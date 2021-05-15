<?php

/**
 * Connector data helper
 */

namespace Simi\Simicustomize\Helper;

use Magento\Framework\App\Filesystem\DirectoryList;

class Data extends \Simi\Simiconnector\Helper\Data
{
    const AUTO_RELATED_PRODUCT_ENABLE = 'siminiaconfig/related_product/enable';

    const AUTO_RELATED_PRODUCT_BACKEND_ENABLE = 'siminiaconfig/related_product/backend_enable';

    const AUTO_RELATED_PRODUCT_LIMIT = 'siminiaconfig/related_product/limit';

    const PWA_STUDIO_URL_CONFIG = 'simiconnector/general/pwa_studio_url';

    public function getAutoRelatedProductEnableConfig() {
        return $this->getStoreConfig(self::AUTO_RELATED_PRODUCT_ENABLE);
    }

    public function getAutoRelatedProductBackendEnableConfig() {
        return $this->getStoreConfig(self::AUTO_RELATED_PRODUCT_BACKEND_ENABLE);
    }

    public function getAutoRelatedProductLimitConfig() {
        return $this->getStoreConfig(self::AUTO_RELATED_PRODUCT_LIMIT);
    }

    public function getPwaUrl() {
        return $this->getStoreConfig(self::PWA_STUDIO_URL_CONFIG);
    }
}
