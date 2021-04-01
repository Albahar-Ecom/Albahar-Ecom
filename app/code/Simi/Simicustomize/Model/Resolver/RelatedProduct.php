<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare( strict_types=1 );

namespace Simi\Simicustomize\Model\Resolver;

use Magento\Framework\Exception\AuthenticationException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlAuthenticationException;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Integration\Api\CustomerTokenServiceInterface;
use Magento\Framework\Exception\AlreadyExistsException;

/**
 * Customers Token resolver, used for GraphQL request processing.
 */
class RelatedProduct implements ResolverInterface {
    /**
     * @var \Simi\Simiconnector\Helper\Data
     */
    public $helperData;

    /**
     * @var \Magento\Catalog\Model\ProductFactory
     */
    public $productFactory;

    /**
     * @var \Magento\Catalog\Model\CategoryFactory
     */
    public $categoryFactory;

    /**
     * @var \Magento\Catalog\Model\CategoryFactory
     */
    public $reportProductCollectionFactory;

    /**
     * @var \Magento\CatalogInventory\Helper\Stock
     */
    public $stockHelper;

	public function __construct(
        \Simi\Simicustomize\Helper\Data $helperData,
        \Magento\Catalog\Model\ProductFactory $productFactory,
        \Magento\Catalog\Model\CategoryFactory $categoryFactory,
        \Magento\Reports\Model\ResourceModel\Product\Collection $collectionFactory,
        \Magento\CatalogInventory\Helper\Stock $stockHelper
	) {
        $this->helperData = $helperData;
        $this->categoryFactory = $categoryFactory;
        $this->productFactory = $productFactory;
        $this->reportProductCollectionFactory = $collectionFactory;
        $this->stockHelper = $stockHelper;
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
		if ( empty( $args['product_id'] ) ) {
			throw new GraphQlInputException( __( 'Specify the "product_id" value.' ) );
		}

		$product = $this->$productFactory->create()->load($args['product_id']);

        $relatedProduct = $product->getRelatedProductCollection();

        $enable = $this->helperData->getAutoRelatedProductEnableConfig();

        if(!$enable) {
            $ids = $product->getCategoryIds();
            $category = null;
            if (!empty($ids)) {
                $category = $this->categoryFactory-create()->load($ids[0]);
            }

            if($category) {
				$limit = $this->helperData->getAutoRelatedProductLimitConfig();
				
                $relatedProduct = $this->reportProductCollectionFactory->create()
                    ->addAttributeToFilter('visibility', array(
                        \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH,
                        \Magento\Catalog\Model\Product\Visibility::VISIBILITY_IN_CATALOG
                    ))
                    ->addAttributeToFilter('status', 1)
                    ->addCategoryFilter($category)
                    ->addAttributeToSelect('*')
                    ->setPageSize($limit);

                if ($product) {
                    $relatedProduct->addAttributeToFilter('entity_id', array(
                            'neq' => $currentProduct->getId())
                    );
                }
                
                $this->stockHelper->addInStockFilterToCollection($relatedProduct);

                return $relatedProduct;
            }
        }

        return [];
	}
}