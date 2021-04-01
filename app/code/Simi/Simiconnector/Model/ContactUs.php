<?php

namespace Simi\Simiconnector\Model;

use Magento\Framework\Filesystem;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Store\Model\StoreManagerInterface;

class ContactUs extends \Magento\Framework\Model\AbstractModel
{
    const ATTACHMENT_DIR = 'simiconnector/contactus/';

    protected $fileSystem;
    protected $storeManager;

    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Simi\Simiconnector\Model\ResourceModel\ContactUs $resource,
        \Simi\Simiconnector\Model\ResourceModel\ContactUs\Collection $resourceCollection,
        Filesystem $fileSystem,
        StoreManagerInterface $storeManager
    ) {
        $this->fileSystem = $fileSystem;
        $this->storeManager = $storeManager;

        parent::__construct(
            $context,
            $registry,
            $resource,
            $resourceCollection
        );
    }

    /**
     * Initialize resource model
     *
     * @return void
     */
    public function _construct()
    {

        $this->_init('Simi\Simiconnector\Model\ResourceModel\ContactUs');
    }

    public function saveAttachment($base64, $name){
        $mediaPath = $this->fileSystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath();
        if ($base64 && $name) {
            try {
                $saveDir  =  $mediaPath.self::ATTACHMENT_DIR;
                if (!file_exists($saveDir)) {
                    mkdir($saveDir, 0775, true);
                }
    
                $random = rand().md5(time());
                $nameParts = explode('.', $name);
                $nameExt = $nameParts[1] ?? '';
                $fileName = $nameParts[0] .'_'. rand().md5(time()) .'.'. $nameExt;
                $filePath = self::ATTACHMENT_DIR . $fileName;
                $fileFullPath = $saveDir.$fileName;
    
                $content = str_replace(' ', '+', $base64); // correct base64 string
                $content = base64_decode($content);
                $filestream = fopen($fileFullPath, "wb");
                fwrite($filestream, $content);
                fclose($filestream);

                $this->setData('attach', $filePath);
            } catch (\Exception $e) {
                throw new \Simi\Simiconnector\Helper\SimiException(__('File was not uploaded'), 4);
            }
        }
        return $this;
    }

    /**
     * @return string url
     */
    public function getAttachment(){
        if ($this->getAttach()) {
            $baseUrl = $this->storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            return $baseUrl . $this->getAttach();
        }
        return '';
    }
}
