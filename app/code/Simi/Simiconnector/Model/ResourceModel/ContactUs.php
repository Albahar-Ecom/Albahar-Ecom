<?php

namespace Simi\Simiconnector\Model\ResourceModel;

/**
 * Simiconnector Resource Model
 */
class ContactUs extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{

    /**
     * Initialize resource model
     *
     * @return void
     */
    public function _construct()
    {
        $this->_init('simiconnector_contactus', 'id');
    }
}
