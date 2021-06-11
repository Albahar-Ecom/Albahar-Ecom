<?php

/**
 * Connector data helper
 */

namespace Simi\Simiconnector\Helper;

use Magento\Framework\App\Filesystem\DirectoryList;

class Checkout extends \Simi\Simiconnector\Helper\Data
{
    /*
     * Get Checkout Terms And Conditions
     */

    public function getCheckoutTermsAndConditions()
    {
        if (!$this->getStoreConfig('simiconnector/terms_conditions/enable_terms')) {
            return null;
        }
        $data            = [];
        $data['title']   = $this->getStoreConfig('simiconnector/terms_conditions/term_title');
        $data['content'] = $this->getStoreConfig('simiconnector/terms_conditions/term_html');
        return $data;
    }

    public function getStoreConfig($path)
    {
        return $this->scopeConfig->getValue($path);
    }

    public function convertOptionsCart($options)
    {
        $data = [];
        $locale         = $this->scopeConfig->getValue(
                'general/locale/code',
                \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                $this->storeManager->getStore()->getId()
            );

        foreach ($options as $option) {
            $item = [
                'option_title' => $option['label']
            ];
            $option_value = null;
            if (is_array($option['value'])) {
                $option_value = strip_tags($option['value'][0]);
            } else {
                $option_value = strip_tags($option['value']);
            }
            if ($locale === 'ar_KW') {
                $option_value = str_replace('KWD','د.ك',$option_value);
            }
            $item['option_value'] = $option_value;
            $data[] = $item;
        }
        return $data;
    }
}
