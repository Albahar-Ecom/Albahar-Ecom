<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Simi\Simicustomize\Model\CartItem\DataProvider\CustomizableOptionValue;

use Magento\Catalog\Model\Config\Source\ProductPriceOptionsInterface;

/**
 * Custom Option Data provider
 */
class PriceUnitLabel extends \Magento\QuoteGraphQl\Model\CartItem\DataProvider\CustomizableOptionValue\PriceUnitLabel
{
    /**
     * Retrieve price value unit
     *
     * @param string $priceType
     * @return string
     */
    public function getData(string $priceType): string
    {
        if (ProductPriceOptionsInterface::VALUE_PERCENT == $priceType) {
            return '%';
        }

        return $this->getCurrencySymbol() ?? '';
    }
}
