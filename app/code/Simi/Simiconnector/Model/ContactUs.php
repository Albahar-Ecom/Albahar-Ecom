<?php

namespace Simi\Simiconnector\Model;

use Magento\Framework\Filesystem;
use Magento\Framework\App\Filesystem\DirectoryList;

class ContactUs extends \Magento\Framework\Model\AbstractModel
{
    const ATTACHMENT_DIR = 'simiconnector/contactus/';

    protected $fileSystem;

    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Simi\Simiconnector\Model\ResourceModel\ContactUs $resource,
        \Simi\Simiconnector\Model\ResourceModel\ContactUs\Collection $resourceCollection,
        Filesystem $fileSystem
    ) {
        $this->fileSystem = $fileSystem;

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
                $fileName = $nameParts[0] . rand().md5(time()) . $nameExt;
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
}
