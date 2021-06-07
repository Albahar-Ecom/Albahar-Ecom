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
                        $productChild = $this->simiObjectManager->create('Magento\Catalog\Model\Product')->load($value['optionId']);
                        $app_prices = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Price')->formatPriceFromProduct($product, true);
                        if (!$productChild->getIsSalable()) {
                            unset($bundle_options['options'][$index]['selections'][$key]);
                            continue;
                        }
                        if (!$product->getAttributeText('price_type')) {
                            $price = 0;
                            if (isset($app_prices['configure']) && isset($app_prices['configure']['price'])) {
                                $price = $app_prices['configure']['price'];
                            }
                            $bundle_options['options'][$index]['selections'][$key]['prices']['oldPrice']['amount'] += $price;
                            $bundle_options['options'][$index]['selections'][$key]['prices']['basePrice']['amount'] += $price;
                            $bundle_options['options'][$index]['selections'][$key]['prices']['finalPrice']['amount'] += $price;
                        }
                        $tierPrice = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Price')->getProductTierPricesLabel($productChild);
                        $bundle_options['options'][$index]['selections'][$key]['app_tier_prices'] = $tierPrice;
                    }
                }
            }
        }
        $options['bundle_options'] = $bundle_options;
        return $options;
    }
}
