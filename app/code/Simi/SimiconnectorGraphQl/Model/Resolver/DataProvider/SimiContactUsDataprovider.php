<?php

namespace Simi\SimiconnectorGraphQl\Model\Resolver\DataProvider;

use Magento\Contact\Model\ConfigInterface;
use Magento\Contact\Model\MailInterface;
use Magento\Framework\App\Action\Context;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\Request\DataPersistorInterface;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Framework\DataObject;
use Magento\Framework\Exception\LocalizedException;
use Magento\Store\Model\StoreManagerInterface;
use Simi\Simiconnector\Model\ContactUsFactory;

class SimiContactUsDataprovider
{
    private $dataPersistor;
    private $mail;
    private $formKey;

    protected $contactUsFactory;
    protected $storeManager;


    public function __construct(
        ConfigInterface $contactsConfig,
        MailInterface $mail,
        DataPersistorInterface $dataPersistor,
        \Magento\Framework\Data\Form\FormKey $formKey,
        ContactUsFactory $contactUsFactory,
        StoreManagerInterface $storeManager
    )
    {
        $this->mail = $mail;
        $this->dataPersistor = $dataPersistor;
        $this->formKey = $formKey;
        $this->contactUsFactory = $contactUsFactory;
        $this->storeManager = $storeManager;
    }

    public function contactUs($input)
    {
        $thanks_message = [];
        try {
            $contactUs = $this->contactUsFactory->create();
            $contactUs->setData($input);
            if (isset($input['attach']) && isset($input['base64file'])) {
                $contactUs->saveAttachment($input['base64file'], $input['attach']);
            }
            $contactUs->setWebsiteId($this->storeManager->getWebsite()->getId());
            $contactUs->save();

            $this->sendEmail($input);
            $contactUs->setEmailSent(1);
            $contactUs->save();
            
        } catch (LocalizedException $e) {
        }
        $thanks_message['success_message'] = __('Thanks for contacting us with your comments and questions. We\'ll respond to you very soon.');

        return $thanks_message;
    }

    private function sendEmail($input)
    {
        $form_data = $input;
        $form_data['hideit'] = "";
        $form_data['form_key'] = $this->getFormKey();

        $this->mail->send(
            $input['email'],
            ['data' => new DataObject($form_data)]
        );
    }

    public function getFormKey()
    {
        return $this->formKey->getFormKey();
    }
}