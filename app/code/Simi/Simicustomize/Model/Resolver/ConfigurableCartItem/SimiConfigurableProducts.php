<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare( strict_types=1 );

namespace Simi\Simicustomize\Model\Resolver\ConfigurableCartItem;

use Magento\Catalog\Helper\Product\Configuration;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use \Magento\Catalog\Model\ProductFactory;

/**
 * Customers Token resolver, used for GraphQL request processing.
 */
class SimiConfigurableProducts implements ResolverInterface {
    /**
     * @var Configuration
     */
    private $configurationHelper;
    
    /**
     * @var ProductRepository
     */
    private $productFactory;

	/**
     * @param Configuration $configurationHelper
     */
    public function __construct(
        Configuration $configurationHelper,
        ProductFactory $productFactory
    ) {
        $this->configurationHelper = $configurationHelper;
        $this->productFactory = $productFactory;
    }

	/**
	 * @inheritdoc
	 */
	public function resolve(
		Field $field,
		$context,
		ResolveInfo $info,
		array $value = null,
		array $args = null
	) {
		if ( empty( $value['model'] ) ) {
			throw new GraphQlInputException( __( 'Specify the "model" value.' ) );
		}

        $cartItem = $value['model'];

        $productModal = $this->productFactory->create();

        // var_dump($cartItem->toArray()); die;
        $products = [];

        if ($cartItem->getHasChildren() ) {
            foreach ($cartItem->getChildren() as $child) {
                $productId = $child->getProductId();
                // var_dump($productId); die;
                $product = $productModal->load($productId);
                if($product) {
                    $products[] = [
                        'product_id' => $productId,
                        'stock_status' => $product->isSalable() ? 'IN_STOCK' : 'OUT_OF_STOCK'
                    ];
                }
               
                // get child quantity by this calling  $child->getQty();
            }
        }

        return $products;
	}
}