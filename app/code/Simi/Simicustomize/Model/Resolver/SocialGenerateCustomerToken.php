<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare( strict_types=1 );

namespace Simi\Simicustomize\Model\Resolver;

use Magento\Framework\Exception\AuthenticationException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlAuthenticationException;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Integration\Api\CustomerTokenServiceInterface;

/**
 * Customers Token resolver, used for GraphQL request processing.
 */
class SocialGenerateCustomerToken implements ResolverInterface {
	/**
	 * @var CustomerTokenServiceInterface
	 */
	private $customerTokenService;

	/**
	 * @var \Magento\Customer\Model\Customer
	 */
	private $customer;

	/**
	 * @var \Magento\Integration\Model\Oauth\TokenFactory
	 */
	private $tokenModelFactory;

	/**
	 * @param CustomerTokenServiceInterface $customerTokenService
	 */
	public function __construct(
		CustomerTokenServiceInterface $customerTokenService,
		\Magento\Customer\Model\Customer $customer,
		\Magento\Integration\Model\Oauth\TokenFactory $tokenModelFactory
	) {
		$this->customerTokenService = $customerTokenService;
		$this->customer             = $customer;
		$this->tokenModelFactory    = $tokenModelFactory;
	}

	/**
	 * @inheritdoc
	 */
	public function resolve(
		Field $field,
		$context,
		ResolveInfo $info,
		array $value = null,
		array $args = null
	) {
		if ( empty( $args['email'] ) ) {
			throw new GraphQlInputException( __( 'Specify the "email" value.' ) );
		}

		if ( empty( $args['id'] ) ) {
			throw new GraphQlInputException( __( 'Specify the "id" value.' ) );
		}

		try {
			$websiteId       = $context->getExtensionAttributes()->getStore()->getWebsiteId();
			$currentCustomer = $this->customer->setWebsiteId( $websiteId )->loadByEmail( $args['email'] );
		}
		catch ( LocalizedException $e ) {
			throw new GraphQlInputException( __( 'Can\'t found an account associate with your phone' ), $e );
		}

		if ( ! $currentCustomer->getId() ) {
			throw new GraphQlInputException( __( 'Can\'t found an account associate with your email' ) );
		}

		try {
			$tokenKey = $this->tokenModelFactory->create()->createCustomerToken( $currentCustomer->getId() )->getToken();

			return [ 'token' => $tokenKey ];
		}
		catch ( AuthenticationException $e ) {
			throw new GraphQlAuthenticationException( __( $e->getMessage() ), $e );
		}
	}
}