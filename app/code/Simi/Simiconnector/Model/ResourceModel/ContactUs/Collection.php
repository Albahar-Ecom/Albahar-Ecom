<?php

/**
 * Simiconnector Resource Collection
 */

namespace Simi\Simiconnector\Model\ResourceModel\ContactUs;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{

    /**
     * Resource initialization
     *
     * @return void
     */
    public function _construct()
    {
        $this->_init('Simi\Simiconnector\Model\ContactUs', 'Simi\Simiconnector\Model\ResourceModel\ContactUs');
    }
}
