<?php

namespace Simi\Simicustomize\Block\Adminhtml\Product\Edit\Tab;

class Related extends \Magento\Framework\View\Element\Template
{

    /**
     * @var \Simi\Simiconnector\Helper\Data
     */
    public $helperData;

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

    /**
     * @param \Simi\Simiconnector\Block\Context $context
     * @param \Magento\Framework\UrlFactory $urlFactory
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Simi\Simicustomize\Helper\Data $helperData,
        \Magento\Catalog\Model\CategoryFactory $categoryFactory,
        \Magento\Reports\Model\ResourceModel\Product\collectionFactory $collectionFactory,
        \Magento\CatalogInventory\Helper\Stock $stockHelper
    )
    {
        parent::__construct($context);
        $this->helperData = $helperData;
        $this->categoryFactory = $categoryFactory;
        $this->reportProductCollectionFactory = $collectionFactory;
        $this->stockHelper = $stockHelper;
    }

        /**
     * Retrieve related products
     *
     * @return array
     */
    public function getSelectedRelatedProducts()
    {
        $enable = $helperData->getAutoRelatedProductEnableConfig();
        if(!$enable) 
            return parent::getSelectedRelatedProducts();
        
        $backendEnable = $helperData->getAutoRelatedProductBackendEnableConfig();
        if(!$backendEnable) 
            return parent::getSelectedRelatedProducts();

        $products = array();

        $currentProduct = $this->getProduct();
        foreach ($currentProduct->getRelatedProducts() as $product) {
            $products[$product->getId()] = array('position' => $product->getPosition());
        }

        $category = $this->_coreRegistry->registry('current_category');

        if($product) {
            $ids = $product->getCategoryIds();
            if (!empty($ids)) {
                $category =  $this->categoryFactory->create()->load($ids[0]);
			}
        }

        if($category) {
            $relatedProduct = $this->reportProductCollectionFactory->create()
                ->addAttributeToFilter('visibility', array(
                    \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH,
                    \Magento\Catalog\Model\Product\Visibility::VISIBILITY_IN_CATALOG
                ))
                ->addAttributeToFilter('status', 1)
                ->addCategoryFilter($category)
                ->addAttributeToSelect('*');
            
            if ($product) {
				$relatedProduct->addAttributeToFilter('entity_id', array(
						'neq' => $currentProduct->getId())
				);
			}

            $this->stockHelper->addInStockFilterToCollection($relatedProduct);

            $relatedProductsIds = array();
            foreach ($relatedProduct as $product) {
                $relatedProductsIds[$product->getId()] = array('position' => $product->getPosition());
            }
            
            return $products + $relatedProductsIds;
        } else {
            return $products;
        }
    }
}
