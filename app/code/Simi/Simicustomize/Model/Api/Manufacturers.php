<?php

/**
 * Copyright © 2016 Simi. All rights reserved.
 */

namespace Simi\Simiconnector\Model\Api;

class Manufacturers extends Apiabstract
{
    public $layer = [];
    public $sortOrders = [];
   
    public function setBuilderQuery()
    {

        $data = $this->getData();
        $parameters = $data['params'];
        $this->helperProduct = $this->simiObjectManager->get('\Simi\Simicustomize\Helper\Products');
        $this->helperProduct->setData($data);

        if ($data['resourceid']) {
            $attCode = $this->simiObjectManager->create('Mageplaza\Shopbybrand\Helper\Data')->getAttributeCode();
            $collection = $this->simiObjectManager->create('Magento\Catalog\Model\ResourceModel\Product\CollectionFactory')->create()
                ->setVisibility($this->simiObjectManager->create('Magento\Catalog\Model\Product\Visibility')->getVisibleInCatalogIds())
                ->addAttributeToSelect('*')
                ->addAttributeToFilter('status', 1)
                ->addAttributeToFilter($attCode, $data['resourceid']);
            $cat_filtered = false;
            if ( isset($parameters['filter']['layer']) ) {
                $this->builderQuery = $collection;
                $this->helperProduct->filterCollectionByAttribute($this->builderQuery, $parameters, $cat_filtered);
            } else {
                $this->builderQuery = $collection;
            }
            $this->setFilterBrand($collection);
        } else {
            $this->builderQuery = $this->simiObjectManager->create('Mageplaza\Shopbybrand\Model\BrandFactory')->create()->getBrandCollection();
        }
        
    }

    public function setFilterBrand($collection){
        $this->layer = $this->helperProduct->getLayerNavigator($collection, null, true);
        $this->sortOrders = $this->helperProduct->getStoreQrders();
    }

    public function index(){
        $info = [];
        $collection = $this->builderQuery;
        foreach ($collection as $entity) {
            $info_detail = $entity->toArray();
            $info_detail['manufacturer_id'] = $info_detail['option_id'];
            $info_detail['name'] = $info_detail['value'];
            $info_detail['image'] = $this->simiObjectManager->create('Mageplaza\Shopbybrand\Helper\Data')->getBrandImageUrl($entity);
            $info[] = $info_detail;
        }

        return [
            'manufacturers' => $info,
        ];
    }


    public function show()
    {
        $collection = $this->builderQuery;
        // $this->filter();
        $data = $this->getData();
        $parameters = $data['params'];
        $this->_order($parameters);
        $page = 1;
        if (isset($parameters[self::PAGE]) && $parameters[self::PAGE]) {
            $page = $parameters[self::PAGE];
        }

        $limit = self::DEFAULT_LIMIT;
        if (isset($parameters[self::LIMIT]) && $parameters[self::LIMIT]) {
            $limit = $parameters[self::LIMIT];
        }

        $offset = $limit * ($page - 1);
        if (isset($parameters[self::OFFSET]) && $parameters[self::OFFSET]) {
            $offset = $parameters[self::OFFSET];
        }
        $collection->setPageSize($offset + $limit);

        $all_ids = [];
        $info = [];
        $total = $collection->getSize();

        if ($offset > $total) {
            throw new \Simi\Simiconnector\Helper\SimiException(__('Invalid method.'), 4);
        }

        $fields = [];
        if (isset($parameters['fields']) && $parameters['fields']) {
            $fields = explode(',', $parameters['fields']);
        }

        $check_limit = 0;
        $check_offset = 0;

        $image_width = isset($parameters['image_width']) ? $parameters['image_width'] : null;
        $image_height = isset($parameters['image_height']) ? $parameters['image_height'] : null;

        foreach ($collection as $entity) {
            if (++$check_offset <= $offset) {
                continue;
            }
            if (++$check_limit > $limit) {
                break;
            }
            
            $info_detail = $entity->toArray($fields);

            $images = [];
            if (!$entity->getData('media_gallery'))
                $entity = $this->simiObjectManager
                    ->create('Magento\Catalog\Model\Product')->load($entity->getId());
            $media_gallery = $entity->getMediaGallery();
            foreach ($media_gallery['images'] as $image) {
                if ($image['disabled'] == 0) {
                    $images[] = [
                        'url' => $this->simiObjectManager->create('\Simi\Simiconnector\Helper\Products')
                            ->getImageProduct($entity, $image['file'], $image_width, $image_height),
                        'position' => $image['position'],
                    ];
                    break;
                }
            }
            if ($this->simiObjectManager->get('Simi\Simiconnector\Helper\Data')->countArray($images) == 0) {
                $images[] = [
                    'url' => $this->simiObjectManager->create('\Simi\Simiconnector\Helper\Products')
                        ->getImageProduct($entity, null, $image_width, $image_height),
                    'position' => 1,
                ];
            }

            $ratings = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Review')
                ->getRatingStar($entity->getId());
            $total_rating = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Review')
                ->getTotalRate($ratings);
            $avg = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Review')
                ->getAvgRate($ratings, $total_rating);

            $info_detail['images'] = $images;
            $info_detail['app_prices'] = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Price')
                ->formatPriceFromProduct($entity);
            $info_detail['app_reviews'] = $this->simiObjectManager
                ->get('\Simi\Simiconnector\Helper\Review')
                ->getProductReviews($entity->getId(), false);
            $info_detail['product_label'] = $this->simiObjectManager->get('\Simi\Simiconnector\Helper\Simiproductlabel')
                ->getProductLabel($entity);
            $info[] = $info_detail;

            $all_ids[] = $entity->getId();
        }
        return $this->getList($info, $all_ids, $total, $limit, $offset);
    }

    public function getList($info, $all_ids, $total, $page_size, $from)
    {
        return [
            'all_ids' => $all_ids,
            'products' => $this->modifyFields($info),
            'total' => $total,
            'page_size' => $page_size,
            'from' => $from,
            'layers' => $this->layer,
            'orders' => $this->sortOrders,
        ];
    }
}   
