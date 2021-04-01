<?php

namespace Simi\Simiconnector\Block\Adminhtml\Form\Field;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;

class Other extends AbstractFieldArray
{
    protected function _prepareToRender()
    {
        $this->addColumn('label', ['label' => __('Label'), 'class' => 'required-entry', 'size' => '300px']);
        $this->addColumn('value', ['label' => __('Content'), 'class' => 'required-entry', 'size' => '200px']);
        $this->_addAfter = false;
        $this->_addButtonLabel = __('Add new row');
    }
}
