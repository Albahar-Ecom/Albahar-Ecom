<?php

namespace Simi\Simiconnector\Model\Api;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Filesystem;
use Magento\Framework\ObjectManagerInterface;

class Base64file
{
    protected $fileSystem;
    protected $objectManager;

    public function __construct(
        Filesystem $fileSystem,
        ObjectManagerInterface $objectManager
    ){
        $this->fileSystem = $fileSystem;
        $this->objectManager = $objectManager;
    }

    public function upload(){
        $mediaPath = $this->fileSystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath();
        $uploader = $this->objectManager->create('Magento\MediaStorage\Model\File\Uploader', ['fileId' => 'file']);
        $file = $uploader->validateFile();

        if (!isset($file['name'])) {
            throw new \Simi\Simiconnector\Helper\SimiException(__('No file name'), 4);
        }

        if ($file['type'] == 'text/php' 
            || strpos($file['type'], 'application') !== false 
            || strpos($file['name'], '.php') !== false
        ) {
            throw new \Simi\Simiconnector\Helper\SimiException(__('No supported type'), 4);
        }

        if (isset($file['base64'])) {
            $base64 = str_replace(' ', '+', $file['base64']);
            return array(
                'name' => $file['name'],
                'base64' => $base64,
            );
        }
        return array();
    }
}
