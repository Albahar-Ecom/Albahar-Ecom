<?php

namespace Simi\Simicustomize\Model;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\DataObject;
use Magento\Framework\UrlInterface;

class Sitemap extends \Magento\Sitemap\Model\Sitemap
{
    /**
     * Get url
     *
     * @param string $url
     * @param string $type
     * @return string
     */
    protected function _getUrl($url, $type = UrlInterface::URL_TYPE_LINK)
    {
        if($type === UrlInterface::URL_TYPE_LINK) {
            $simiHelper = ObjectManager::getInstance()->get(\Simi\Simicustomize\Helper\Data::class);
        
            $pwaStudioUrl = $simiHelper->getStoreConfig('simiconnector/general/pwa_studio_url');
            if(!empty($pwaStudioUrl)) {
                return $pwaStudioUrl . ltrim($url, '/');
            }
        }

        return $this->_getStoreBaseUrl($type) . ltrim($url, '/');
    }

    public function generateXml()
    {
        $parent = parent::generateXml();

        $absolutePath = $this->_getBaseDir();

        $pwaRootPath = $absolutePath . 'reactjs-pwa/packages/siminia/static/';

        $siteMapFileName = $this->getSitemapFilename();
        $siteMapPath = $this->_getBaseDir() . $siteMapFileName;
             
        $pwaPath = $pwaRootPath . $siteMapFileName;

        if(is_file($pwaRootPath) || is_dir($pwaRootPath)) {
            copy($siteMapPath, $pwaPath);
        }

        return $parent;
    }
}
