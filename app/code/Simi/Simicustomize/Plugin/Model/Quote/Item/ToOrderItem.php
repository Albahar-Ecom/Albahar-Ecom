<?php 
namespace Simi\Simicustomize\Plugin\Model\Quote\Item;

class ToOrderItem {

    /**
     *
     * @var type \Magento\Catalog\Model\Product
     */
    protected $productRepository;

    /**
     * @param \Magento\Catalog\Model\Product $productRepository 
     */
    public function __construct(
        \Magento\Catalog\Model\Product $productRepository 
    ) {
        $this->productRepository = $productRepository;
    }

    /**
     * 
     * @param \Magento\Quote\Model\Quote\Item\ToOrderItem $subject
     * @param \Vendorname\Modulename\Plugin\Model\Quote\Item\callable $proceed
     * @param \Magento\Quote\Model\Quote\Item\AbstractItem $item
     * @param type $additional
     * @return type
     */
    public function aroundConvert(
        \Magento\Quote\Model\Quote\Item\ToOrderItem $subject, 
        callable $proceed, 
        \Magento\Quote\Model\Quote\Item\AbstractItem $item, 
        $additional = []
    ) {
        $orderItem = $proceed($item, $additional);
        $productId = $item->getProduct()->getId();
        $product = $this->productRepository->load($productId);
        $bu = $product->getBu(); // Business Unit product attribute
        // var_dump($product->getBu());die;
        $orderItem->setBu($bu);//saving into orde item in `bu` column
        // var_dump(get_class($orderItem));die;
        return $orderItem;
    }
}