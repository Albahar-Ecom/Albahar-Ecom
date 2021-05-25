<?php
/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_CurrencyFormatter
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

namespace Mageplaza\CurrencyFormatter\Ui\DataProvider\Product\Form\Modifier;

use Magento\Catalog\Api\Data\ProductAttributeInterface;
use Magento\Catalog\Api\ProductAttributeGroupRepositoryInterface;
use Magento\Catalog\Api\ProductAttributeRepositoryInterface;
use Magento\Catalog\Model\Attribute\ScopeOverriddenValue;
use Magento\Catalog\Model\Locator\LocatorInterface;
use Magento\Catalog\Model\Product;
use Magento\Catalog\Model\Product\Type as ProductType;
use Magento\Catalog\Model\ResourceModel\Eav\Attribute as EavAttribute;
use Magento\Catalog\Model\ResourceModel\Eav\AttributeFactory as EavAttributeFactory;
use Magento\Catalog\Ui\DataProvider\CatalogEavValidationRules;
use Magento\Catalog\Ui\DataProvider\Product\Form\Modifier\Eav\CompositeConfigProcessor;
use Magento\Eav\Api\Data\AttributeGroupInterface;
use Magento\Eav\Model\Config;
use Magento\Eav\Model\ResourceModel\Entity\Attribute\CollectionFactory as AttributeCollectionFactory;
use Magento\Eav\Model\ResourceModel\Entity\Attribute\Group\CollectionFactory as GroupCollectionFactory;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Api\SortOrderBuilder;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\Request\DataPersistorInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\AuthorizationInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Filter\Translit;
use Magento\Framework\Locale\CurrencyInterface;
use Magento\Framework\Stdlib\ArrayManager;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Ui\DataProvider\Mapper\FormElement as FormElementMapper;
use Magento\Ui\DataProvider\Mapper\MetaProperties as MetaPropertiesMapper;
use Magento\Ui\DataProvider\Modifier\ModifierInterface;
use Mageplaza\CurrencyFormatter\Helper\Data;
use Zend_Currency;

/**
 * Class Eav
 *
 * @package Mageplaza\CurrencyFormatter\Ui\DataProvider\Product\Form\Modifier
 */
class Eav implements ModifierInterface
{
    const DATA_SOURCE_DEFAULT = 'product';

    /**
     * @var LocatorInterface
     * @since 101.0.0
     */
    protected $locator;

    /**
     * @var Config
     * @since 101.0.0
     */
    protected $eavConfig;

    /**
     * @var CatalogEavValidationRules
     * @since 101.0.0
     */
    protected $catalogEavValidationRules;

    /**
     * @var RequestInterface
     * @since 101.0.0
     */
    protected $request;

    /**
     * @var GroupCollectionFactory
     * @since 101.0.0
     */
    protected $groupCollectionFactory;

    /**
     * @var StoreManagerInterface
     * @since 101.0.0
     */
    protected $storeManager;

    /**
     * @var FormElementMapper
     * @since 101.0.0
     */
    protected $formElementMapper;

    /**
     * @var MetaPropertiesMapper
     * @since 101.0.0
     */
    protected $metaPropertiesMapper;

    /**
     * @var ProductAttributeGroupRepositoryInterface
     * @since 101.0.0
     */
    protected $attributeGroupRepository;

    /**
     * @var SearchCriteriaBuilder
     * @since 101.0.0
     */
    protected $searchCriteriaBuilder;

    /**
     * @var ProductAttributeRepositoryInterface
     * @since 101.0.0
     */
    protected $attributeRepository;

    /**
     * @var SortOrderBuilder
     * @since 101.0.0
     */
    protected $sortOrderBuilder;

    /**
     * @var EavAttributeFactory
     * @since 101.0.0
     */
    protected $eavAttributeFactory;

    /**
     * @var Translit
     * @since 101.0.0
     */
    protected $translitFilter;

    /**
     * @var ArrayManager
     * @since 101.0.0
     */
    protected $arrayManager;

    /**
     * @var ScopeOverriddenValue
     */
    private $scopeOverriddenValue;

    /**
     * @var array
     */
    private $attributesToDisable;

    /**
     * @var array
     * @since 101.0.0
     */
    protected $attributesToEliminate;

    /**
     * @var DataPersistorInterface
     * @since 101.0.0
     */
    protected $dataPersistor;

    /**
     * @var EavAttribute[]
     */
    private $attributes = [];

    /**
     * @var AttributeGroupInterface[]
     */
    private $attributeGroups = [];

    /**
     * @var array
     */
    private $prevSetAttributes;

    /**
     * @var AttributeCollectionFactory
     */
    private $attributeCollectionFactory;

    /**
     * @var CompositeConfigProcessor
     */
    private $wysiwygConfigProcessor;

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @var AuthorizationInterface
     */
    private $auth;

    /**
     * @var Data
     */
    private $data;

    /**
     * @var CurrencyInterface
     */
    protected $_localeCurrency;

    /**
     * Eav constructor.
     *
     * @param LocatorInterface                         $locator
     * @param CatalogEavValidationRules                $catalogEavValidationRules
     * @param Config                                   $eavConfig
     * @param RequestInterface                         $request
     * @param GroupCollectionFactory                   $groupCollectionFactory
     * @param StoreManagerInterface                    $storeManager
     * @param FormElementMapper                        $formElementMapper
     * @param MetaPropertiesMapper                     $metaPropertiesMapper
     * @param ProductAttributeGroupRepositoryInterface $attributeGroupRepository
     * @param ProductAttributeRepositoryInterface      $attributeRepository
     * @param SearchCriteriaBuilder                    $searchCriteriaBuilder
     * @param SortOrderBuilder                         $sortOrderBuilder
     * @param EavAttributeFactory                      $eavAttributeFactory
     * @param Translit                                 $translitFilter
     * @param ArrayManager                             $arrayManager
     * @param ScopeOverriddenValue                     $scopeOverriddenValue
     * @param DataPersistorInterface                   $dataPersistor
     * @param Data                                     $data
     * @param array                                    $attributesToDisable
     * @param array                                    $attributesToEliminate
     * @param CompositeConfigProcessor|null            $wysiwygConfigProcessor
     * @param ScopeConfigInterface|null                $scopeConfig
     * @param AttributeCollectionFactory|null          $attributeCollectionFactory
     * @param AuthorizationInterface|null              $auth
     */
    public function __construct(
        LocatorInterface $locator,
        CatalogEavValidationRules $catalogEavValidationRules,
        Config $eavConfig,
        RequestInterface $request,
        GroupCollectionFactory $groupCollectionFactory,
        StoreManagerInterface $storeManager,
        FormElementMapper $formElementMapper,
        MetaPropertiesMapper $metaPropertiesMapper,
        ProductAttributeGroupRepositoryInterface $attributeGroupRepository,
        ProductAttributeRepositoryInterface $attributeRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        SortOrderBuilder $sortOrderBuilder,
        EavAttributeFactory $eavAttributeFactory,
        Translit $translitFilter,
        ArrayManager $arrayManager,
        ScopeOverriddenValue $scopeOverriddenValue,
        DataPersistorInterface $dataPersistor,
        Data $data,
        CurrencyInterface $_localeCurrency,
        $attributesToDisable = [],
        $attributesToEliminate = [],
        CompositeConfigProcessor $wysiwygConfigProcessor = null,
        ScopeConfigInterface $scopeConfig = null,
        AttributeCollectionFactory $attributeCollectionFactory = null,
        ?AuthorizationInterface $auth = null
    ) {
        $this->locator = $locator;
        $this->catalogEavValidationRules = $catalogEavValidationRules;
        $this->eavConfig = $eavConfig;
        $this->request = $request;
        $this->groupCollectionFactory = $groupCollectionFactory;
        $this->storeManager = $storeManager;
        $this->formElementMapper = $formElementMapper;
        $this->metaPropertiesMapper = $metaPropertiesMapper;
        $this->attributeGroupRepository = $attributeGroupRepository;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->attributeRepository = $attributeRepository;
        $this->sortOrderBuilder = $sortOrderBuilder;
        $this->eavAttributeFactory = $eavAttributeFactory;
        $this->translitFilter = $translitFilter;
        $this->arrayManager = $arrayManager;
        $this->scopeOverriddenValue = $scopeOverriddenValue;
        $this->dataPersistor = $dataPersistor;
        $this->data = $data;
        $this->_localeCurrency = $_localeCurrency;
        $this->attributesToDisable = $attributesToDisable;
        $this->attributesToEliminate = $attributesToEliminate;
        $this->wysiwygConfigProcessor = $wysiwygConfigProcessor
            ?: ObjectManager::getInstance()->get(CompositeConfigProcessor::class);
        $this->scopeConfig = $scopeConfig ?: ObjectManager::getInstance()->get(ScopeConfigInterface::class);
        $this->attributeCollectionFactory = $attributeCollectionFactory
            ?: ObjectManager::getInstance()->get(AttributeCollectionFactory::class);
        $this->auth = $auth ?? ObjectManager::getInstance()->get(AuthorizationInterface::class);
    }

    /**
     * @param array $data
     * @return array
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function modifyData(array $data)
    {
        if (!$this->locator->getProduct()->getId() && $this->dataPersistor->get('catalog_product')) {
            return $this->resolvePersistentData($data);
        }

        $productId = $this->locator->getProduct()->getId();

        /** @var string $groupCode */
        foreach (array_keys($this->getGroups()) as $groupCode) {
            /** @var ProductAttributeInterface[] $attributes */
            $attributes = !empty($this->getAttributes()[$groupCode]) ? $this->getAttributes()[$groupCode] : [];

            foreach ($attributes as $attribute) {
                if (null !== ($attributeValue = $this->setupAttributeData($attribute))) {
                    if ($this->isPriceAttribute($attribute, $attributeValue)) {
                        $attributeValue = $this->formatPrice($attributeValue);
                    }
                    $data[$productId][self::DATA_SOURCE_DEFAULT][$attribute->getAttributeCode()] = $attributeValue;
                }
            }
        }

        return $data;
    }

    /**
     * @param $value
     * @return mixed
     * @throws NoSuchEntityException
     * @throws \Zend_Currency_Exception
     */
    protected function formatPrice($value)
    {
        $currency = $this->storeManager->getStore()->getCurrentCurrency()->getCode();
        $config = $this->getFormatByCurrency($currency, $this->getStoreId());
        $decimal = (int) $config['decimal_number'];

        $options['precision'] = $decimal;
        $options['display'] = Zend_Currency::NO_SYMBOL;
        $firstResult = $this->_localeCurrency->getCurrency($currency)->toCurrency($value, $options);

        return $firstResult;
    }

    /**
     * @param string $currencyCode
     * @param null $storeId
     *
     * @return mixed
     * @throws NoSuchEntityException
     */
    public function getFormatByCurrency($currencyCode, $storeId = null)
    {
        $storeId = ($storeId === null) ? $this->getStoreId() : $storeId;

        return $this->data->getCurrencyConfig($currencyCode, $storeId);
    }

    /**
     * @return int
     * @throws NoSuchEntityException
     */
    public function getStoreId()
    {
        return $this->storeManager->getStore()->getId();
    }

    /**
     * @param ProductAttributeInterface $attribute
     * @param                           $attributeValue
     * @return bool
     */
    private function isPriceAttribute(ProductAttributeInterface $attribute, $attributeValue)
    {
        return $attribute->getFrontendInput() === 'price'
            && is_scalar($attributeValue)
            && !$this->isBundleSpecialPrice($attribute);
    }

    /**
     * @param ProductAttributeInterface $attribute
     * @return bool
     */
    private function isBundleSpecialPrice(ProductAttributeInterface $attribute)
    {
        return $this->locator->getProduct()->getTypeId() === ProductType::TYPE_BUNDLE
            && $attribute->getAttributeCode() === ProductAttributeInterface::CODE_SPECIAL_PRICE;
    }

    /**
     * @param ProductAttributeInterface $attribute
     * @return mixed|null
     */
    public function setupAttributeData(ProductAttributeInterface $attribute)
    {
        $product = $this->locator->getProduct();
        $productId = $product->getId();
        $prevSetId = $this->getPreviousSetId();
        $notUsed = !$prevSetId
            || ($prevSetId && !in_array($attribute->getAttributeCode(), $this->getPreviousSetAttributes()));

        if ($productId && $notUsed) {
            return $this->getValue($attribute);
        }

        return null;
    }

    /**
     * @param ProductAttributeInterface $attribute
     * @return mixed|null
     */
    private function getValue(ProductAttributeInterface $attribute)
    {
        /** @var Product $product */
        $product = $this->locator->getProduct();

        return $product->getData($attribute->getAttributeCode());
    }

    /**
     * @return array
     */
    private function getPreviousSetAttributes()
    {
        if ($this->prevSetAttributes === null) {
            $searchCriteria = $this->searchCriteriaBuilder
                ->addFilter('attribute_set_id', $this->getPreviousSetId())
                ->create();
            $attributes = $this->attributeRepository->getList($searchCriteria)->getItems();
            $this->prevSetAttributes = [];
            foreach ($attributes as $attribute) {
                $this->prevSetAttributes[] = $attribute->getAttributeCode();
            }
        }

        return $this->prevSetAttributes;
    }

    /**
     * @return int
     */
    private function getPreviousSetId()
    {
        return (int)$this->request->getParam('prev_set_id', 0);
    }

    /**
     * @param array $data
     * @return array
     */
    private function resolvePersistentData(array $data)
    {
        $persistentData = (array)$this->dataPersistor->get('catalog_product');
        $this->dataPersistor->clear('catalog_product');
        $productId = $this->locator->getProduct()->getId();

        if (empty($data[$productId][self::DATA_SOURCE_DEFAULT])) {
            $data[$productId][self::DATA_SOURCE_DEFAULT] = [];
        }

        $data[$productId] = array_replace_recursive(
            $data[$productId][self::DATA_SOURCE_DEFAULT],
            $persistentData
        );

        return $data;
    }

    /**
     * @return AttributeGroupInterface[]
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    private function getGroups()
    {
        if (!$this->attributeGroups) {
            $searchCriteria = $this->prepareGroupSearchCriteria()->create();
            $attributeGroupSearchResult = $this->attributeGroupRepository->getList($searchCriteria);
            foreach ($attributeGroupSearchResult->getItems() as $group) {
                $this->attributeGroups[$this->calculateGroupCode($group)] = $group;
            }
        }

        return $this->attributeGroups;
    }

    /**
     * @return SearchCriteriaBuilder
     */
    private function prepareGroupSearchCriteria()
    {
        return $this->searchCriteriaBuilder->addFilter(
            AttributeGroupInterface::ATTRIBUTE_SET_ID,
            $this->getAttributeSetId()
        );
    }

    /**
     * Return current attribute set id
     *
     * @return int|null
     */
    private function getAttributeSetId()
    {
        return $this->locator->getProduct()->getAttributeSetId();
    }

    /**
     * @param AttributeGroupInterface $group
     * @return string
     */
    private function calculateGroupCode(AttributeGroupInterface $group)
    {
        $attributeGroupCode = $group->getAttributeGroupCode();

        if ($attributeGroupCode === 'images') {
            $attributeGroupCode = 'image-management';
        }

        return $attributeGroupCode;
    }

    /**
     * @return ProductAttributeInterface[]|EavAttribute[]
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    private function getAttributes()
    {
        if (!$this->attributes) {
            $this->attributes = $this->loadAttributesForGroups($this->getGroups());
        }

        return $this->attributes;
    }

    /**
     * @param array $groups
     * @return array
     */
    private function loadAttributesForGroups(array $groups)
    {
        $attributes = [];
        $groupIds = [];

        foreach ($groups as $group) {
            $groupIds[$group->getAttributeGroupId()] = $this->calculateGroupCode($group);
            $attributes[$this->calculateGroupCode($group)] = [];
        }

        $collection = $this->attributeCollectionFactory->create();
        $collection->setAttributeGroupFilter(array_keys($groupIds));

        $mapAttributeToGroup = [];

        foreach ($collection->getItems() as $attribute) {
            $mapAttributeToGroup[$attribute->getAttributeId()] = $attribute->getAttributeGroupId();
        }

        $sortOrder = $this->sortOrderBuilder
            ->setField('sort_order')
            ->setAscendingDirection()
            ->create();

        $searchCriteria = $this->searchCriteriaBuilder
            ->addFilter(AttributeGroupInterface::GROUP_ID, array_keys($groupIds), 'in')
            ->addFilter(ProductAttributeInterface::IS_VISIBLE, 1)
            ->addSortOrder($sortOrder)
            ->create();

        $groupAttributes = $this->attributeRepository->getList($searchCriteria)->getItems();

        $productType = $this->getProductType();

        foreach ($groupAttributes as $attribute) {
            $applyTo = $attribute->getApplyTo();
            $isRelated = !$applyTo || in_array($productType, $applyTo);
            if ($isRelated) {
                $attributeGroupId = $mapAttributeToGroup[$attribute->getAttributeId()];
                $attributeGroupCode = $groupIds[$attributeGroupId];
                $attributes[$attributeGroupCode][] = $attribute;
            }
        }

        return $attributes;
    }

    /**
     * Get product type
     *
     * @return null|string
     */
    private function getProductType()
    {
        return (string)$this->request->getParam('type', $this->locator->getProduct()->getTypeId());
    }

    /**
     * @param array $meta
     * @return array
     */
    public function modifyMeta(array $meta)
    {
        return $meta;
    }
}