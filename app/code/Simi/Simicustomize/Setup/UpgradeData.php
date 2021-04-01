<?php

namespace Simi\Simiconnector\Setup;

use Magento\Cms\Model\PageFactory;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\UpgradeDataInterface;

class UpgradeData implements UpgradeDataInterface
{

    /**
     * @var PageFactory
     */
    protected $_pageFactory;

    /**
     * Config factory
     * @var \Magento\Config\Model\Config\Factory
     */
    private $configFactory;

    /**
     * @param PageFactory $pageFactory
     * @param \Magento\Config\Model\Config\Factory $configFactory
     * @param \Magento\Framework\App\State $state
     */
    public function __construct(
        PageFactory $pageFactory,
        \Magento\Config\Model\Config\Factory $configFactory
    )
    {
        $this->configFactory = $configFactory;
        $this->_pageFactory = $pageFactory;
    }

    /**
     * @param ModuleDataSetupInterface $setup
     * @param ModuleContextInterface $context
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if (version_compare($context->getVersion(), '0.0.2') < 0) {
            $page = $this->_pageFactory->create();
            // albahar faq 
            if (!$page->load('albahar-faq', 'identifier')->getId()) {
                $faqPage = [
                    'title' => 'FAQ',
                    'identifier' => 'albahar-faq',
                    'stores' => [0],
                    'is_active' => 1,
                    'content_heading' => 'FAQ',
                    'content' => `<div class="std"><h1 class="western"><span>FAQ</span></h1>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>General enquiries Al-Bahar Online</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>What is Al-Bahar Online ?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>www.albaharonline.com is the e-commerce site for Al-Bahar Group companies. Here you can find a wide variety of FMCG products, electronics, office equipment related products from world famous brands like Unilever, GE, Al Alali and many more<br></span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>How secure is shopping with Al-Bahar Online<br></span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Al-Bahar Online ensures you have a secure shopping experience Al-Bahar Online works only with market established and secure encrypted payment gateways. We place the highest importance on keeping your information secure. We also guarantee that all of your personal information is used only in accordance with the Al-Bahar Online privacy policy. For more details of the privacy policy, please click here.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Account enquiries -Why do I need to register?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We register you to ensure we are capturing your correct delivery address and to ensure that we can provide you with a safe shopping environment. The registration also helps to ensure that we highlight the optimal shopping choices for you.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>How do I create an Al-Bahar Online account?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>You can click on the &nbsp;signup link at the top of the page, follow the onscreen instructions to be an Al-Bahar Online account holder.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Why do I need a password?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>You need a password along with your Al-Bahar Online account to be able to transact on the site keep your details and account settings from other use.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>What if I forgot my Password?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Please click on the forgot password link and then follow the directions, need more assistance? Please contact our customer service hotline on1848848</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>After I have created my account, can I place my first order anytime?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Once you have&nbsp;created account and&nbsp;logged on; you can make your first purchase at your convenience whether you buy from&nbsp;Food, Home Care, Personal Care, Home Appliances and Air Conditioners or Office Equipment's.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Will my Al-Bahar Online account expire if I do not use it for a while?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>No, it will remain valid.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;">&nbsp;<span style="font-family: 'Book Antiqua', serif;"><span>How can I get my name removed from the Al-Bahar Online mailing list?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Please write to <a href="mailto:support@albaharonline.com">support@albaharonline.com</a> or use the contact us page with the subject line “remove from mailing list.” Please note that it may take up to 3 days to action your request. In addition, each electronic mailing we send you will contain details of how you can cancel your subscription.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>How can I cancel my Al-Bahar Online account?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Please write to <a href="mailto:support@albaharonline.com">support@albaharonline.com</a> or use the contact us page with the subject line” cancel account. Please note that it may take up to 3 days to action your request. In addition, each electronic mailing we send you will contain details of how you can cancel your account.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Order enquiries</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>How do I place an order on Al-Bahar Online ?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Select an item by clicking on “add to cart” All items you’ve selected will be saved in your Al-Bahar Online shopping cart, which can be viewed at any time by clicking on the&nbsp;shopping cart link&nbsp;at the top of the page.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>.</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>What payment methods can I use to pay for my order?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We offer multiple payment methods including K-net, Credit Card, K-net on delivery, Cash on delivery and so forth.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Status and delivery enquiries</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>When will I receive the items, I ordered from Al-Bahar Online ?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We will deliver your items as soon as possible. Products that require installation, such as Air Conditioning may take longer to deliver and install. Please refer to your order to find the scheduled time of delivery.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>What are delivery charges ?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>There is no extra cost involved for our Home delivery service. However an Al-Bahar Online &nbsp;shopping cart&nbsp;should be at a minimum amount of 80 KD to qualify for free delivery, all orders under the 80 KD amount will incur a minimum fee of 2 KD. Minimum checkout value is KD 20/-</span></span></span></p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>4.6&nbsp;How can I speed up my products delivery?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We at Al-Bahar Online generally ensure that you receive your products as soon as possible, and all of that depends on the accuracy of the address details you provide when selecting or editing your delivery address location.</span></span></span></p>
                    <p><span style="color: #000000;">&nbsp;<span style="font-family: 'Book Antiqua', serif;"><span>I ordered multiple items from Al-Bahar Online but received only half the items I ordered, what’s the reason for that?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We fast track shipments across multiple warehouses to ensure we are able to deliver your goods on priority. This may mean that you could receive several shipments from us depending on the nature of goods ordered. E.g. You may get all your consumer goods together and the electronics appliances maybe delivered separately.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>How much do I need to pay for my installation service?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Normally all goods requiring installation are provided with free installations, e.g. air conditioners or gas cookers, etc. Small kitchen appliances are not installed.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;">&nbsp;<span style="font-family: 'Book Antiqua', serif;"><span>How can I return or exchange items I bought through Al-Bahar Online ?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>We are compliant with Kuwait ministry of commerce rules and regulations governing refunds and replacements, for detailed terms and conditions regarding returns and refunds please click here. The Returns and exchange have been made easy for you at Al-Bahar Online . You can return or exchange your product within 14 days of purchase by calling customer care at 1848848 or emailing us at&nbsp;<a href="mailto:support@albaharonline.com">support@albaharonline.com</a> to schedule pick up from your home.</span></span></span></p>
                    <p>&nbsp;</p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>I need help to operate my new unit?</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>Our support team is available at the contact center 1848848. Please call and register a request, we will arrange for our technicians to call or visit as the case maybe.</span></span></span></p>
                    <p><span style="color: #000000;"><span style="font-family: 'Book Antiqua', serif;"><span>All these details can be obtained by emailing us through the Contact Us page.</span></span></span></p>
                    <p>&nbsp;</p></div>`,
                    'page_layout' => '1column'
                ];

                $page->setData($faqPage)->save();
            }

        }

        $setup->endSetup();
    }

}