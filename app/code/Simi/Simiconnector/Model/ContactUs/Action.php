<?php
namespace Simi\Simiconnector\Model\ContactUs;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Data\OptionSourceInterface;
use Magento\Framework\Phrase;

/**
 * Gift Card action functionality model
 */
class Action implements OptionSourceInterface
{
    /**
     * Gift Card Status
     */
    const ACTION_EDIT = 1;
    // const ACTION_SEND = 3;

    /**
     * Retrieve option array
     *
     * @return string[]
     */
    public static function getOptionArray()
    {
        return [
            self::ACTION_EDIT => __('Edit'),
        ];
    }

    /**
     * Retrieve option array with empty value
     *
     * @return string[]
     */
    public function toOptionArray()
    {
        $result = [];

        foreach (self::getOptionArray() as $index => $value) {
            $result[] = ['value' => $index, 'label' => $value];
        }

        return $result;
    }

    /**
     * @param $type
     * @param $params
     *
     * @return Phrase|string
     */
    public static function getActionLabel($type)
    {
        $message = '';

        switch ($type) {
            case self::ACTION_EDIT:
                $message = $message ?: __('Edit');
                break;
            default:
                break;
        }

        return $message;
    }
}
