<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare( strict_types=1 );

namespace Simi\Simicustomize\Model\Resolver\Attribute;

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
class FrontendInput implements ResolverInterface {
    /**
     * @var \Magento\CatalogInventory\Helper\Stock
     */
    public $productAttributeRepository;

	public function __construct(
        \Magento\Catalog\Api\ProductAttributeRepositoryInterface $productAttributeRepository
	) {
        $this->productAttributeRepository = $productAttributeRepository;
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
        if (!isset($value['attribute_id_v2']) && !isset($value['attribute_id'])) {
            throw new GraphQlInputException(__('Value must contain "model" property.'));
        }

        $attributeId = $value['attribute_id_v2'] ?? $value['attribute_id'];

        $attribute = $this->productAttributeRepository->get($attributeId);

        $frontendInput = $attribute->getFrontendInput();

        if($frontendInput) {
            return $frontendInput;
        }

        return '';
	}
}