<?php

/**
 * Connector data helper
 */

namespace Simi\Simiconnector\Helper\Options;

class Bundle extends \Simi\Simiconnector\Helper\Options
{

    public function getOptions($product)
    {
        $layout                    = $this->simiObjectManager->get('Magento\Framework\View\LayoutInterface');
        $block                     = $layout->createBlock('Magento\Bundle\Block\Catalog\Product\View\Type\Bundle');
        $block->setProduct($product);
        $options                   = [];
        $bundle_options      = json_decode($block->getJsonConfig(), true);
        if (isset($bundle_options['options'])) {
            foreach ($bundle_options['options'] as $index => $bundle_option) {
                $optionModel = $this->simiObjectManager->get('Magento\Bundle\Model\Option')->load($index);
                if ($optionModel->getId()) {
                    $bundle_options['options'][$index]['isRequired'] = $optionModel->getData('required');
                    $bundle_options['options'][$index]['type'] = $optionModel->getData('type');

                    foreach ($bundle_options['options'][$index]['selections'] as $key => $value) {
                        $product = $this->simiObjectManager->create('Magento\Catalog\Model\Product')->load($value['optionId']);
                        if (!$product->getIsSalable()) {
                            unset($bundle_options['options'][$index]['selections'][$key]);
                            continue;
                        }
                        $tierPrice = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Price')->getProductTierPricesLabel($product);
                        $bundle_options['options'][$index]['selections'][$key]['app_tier_prices'] = $tierPrice;
                    }
                }
            }
        }
        $options['bundle_options'] = $bundle_options;
        return $options;
    }
}
