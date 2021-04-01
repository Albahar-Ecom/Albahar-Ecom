<?php

namespace Simi\Simiconnector\Controller\Adminhtml\Contactus;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;

class Index extends Action
{
    /** Authorization level of a basic admin session */
    const ADMIN_RESOURCE = 'Magento_Customer::customer';

    /**
     * @var PageFactory
     */
    protected $resultPageFactory;

    /**
     * @param Context $context
     * @param PageFactory $resultPageFactory
     */
    public function __construct(
        Context $context,
        PageFactory $resultPageFactory
    ) {
        $this->resultPageFactory = $resultPageFactory;
        parent::__construct($context);
    }

    /**
     * Default customer account page
     *
     * @return \Magento\Framework\View\Result\Page
     */
    public function execute()
    {
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Simi_Simiconnector::simi_contactus');
        $resultPage->addBreadcrumb(__('Simi Admin'), __('Simi Admin'));
        $resultPage->addBreadcrumb(__('Contact Us'), __('Contact Us'));
        $resultPage->getConfig()->getTitle()->prepend(__('Contact Us'));
        return $resultPage;
    }
}
