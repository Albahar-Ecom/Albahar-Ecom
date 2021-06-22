<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare( strict_types=1 );

namespace Simi\Simicustomize\Model\Resolver\Product;

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
class Discount implements ResolverInterface {
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
     * @var \Magento\CatalogRule\Model\ResourceModel\RuleFactory
     */
    public $resourceRuleFactory;

    /**
     * @var \Magento\Customer\Model\CustomerFactory
     */
    public $customerFactory;

	public function __construct(
        \Magento\CatalogRule\Model\ResourceModel\RuleFactory $resourceRuleFactory,
        \Magento\Customer\Model\CustomerFactory $customerFactory,
        \Magento\Framework\Stdlib\DateTime\TimezoneInterface $localeDate,
        \Magento\Store\Model\StoreManagerInterface $storeManager

	) {
        $this->resourceRuleFactory = $resourceRuleFactory;
        $this->customerFactory = $customerFactory;
        $this->localeDate = $localeDate;
        $this->storeManager = $storeManager;
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
        if (!isset($value['model'])) {
            throw new GraphQlInputException(__('Value must contain "model" property.'));
        }

        $product = $value['model'];
        $customerGroupId = null;
        if (false !== $context->getExtensionAttributes()->getIsCustomer()) {
            $customerId = (int) $context->getUserId();
            $customerModel = $this->customerFactory->create();
            $customer = $customerModel->load($customerId);
            $customerGroupId = $customer->getGroupId();
        }
        
        if($customerGroupId) {
            $storeId = $product->getStoreId();
            $date = $this->localeDate->scopeDate($storeId);
            $websiteId = $this->storeManager->getStore($storeId)->getWebsiteId();
            $productIds = $this->getProductId($product);
            $rulePrices  = $this->resourceRuleFactory->create()->getRulePrices($date, $websiteId, $customerGroupId, $productIds);
            $formatRulePrices = [];
            foreach ($rulePrices as $key => $rulePrice) {
                $formatRulePrices[] = ['product_id' => (int)$key, 'amount' => $rulePrice];
            }

            return $formatRulePrices;
        }


        return [];
	}

    private function getProductId($product) {
        $productIds = [];
        $productIds[] = $product->getId();
        if($product->getTypeId() == 'configurable') {
            $childProducts = $product->getTypeInstance()->getUsedProducts($product);
            foreach ($childProducts as $childProduct) {
                $productIds[] = $childProduct->getId();
            }
        } elseif ($product->getTypeId() == 'bundle') {
            $requiredChildrenIds = $product->getTypeInstance()->getChildrenIds($product->getId(), true);
            foreach ($requiredChildrenIds as $requiredChildrenId) {
                $productIds[] = $requiredChildrenId;
            }
        }

        return $productIds;
    }
}