import React, { useCallback } from 'react';
import { useCartPage } from 'src/simi/talons/CartPage/useCartPage';
import { GET_CART_DETAILS } from './cartPage.gql';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import {
    showFogLoading,
    hideFogLoading
} from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { useWindowSize } from '@magento/peregrine';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import ProductListing from './ProductListing'
import { showToastMessage } from 'src/simi/Helper/Message'
import PriceSummary from './PriceSummary'
import Coupon from './PriceAdjustments/CouponCode'
import Estimate from './Estimate';
import EmptyCart from './EmptyCart';
import {getSalesConfig} from '../Helper/Data'
import {formatPrice} from 'src/simi/Helper/Pricing'

require('./cart.scss');
let toggledErrMessOnce = false

const CartPage = props => {
    const { toggleMessages, history, location } = props
    const talonProps = useCartPage({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });
    const {
        handleSignIn,
        hasItems,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        cart,
        errors
    } = talonProps;

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const salesConfig = getSalesConfig()

    const cartCurrencyCode = (cart && cart.prices && cart.prices.grand_total && cart.prices.grand_total.currency);

    if (location && location.search && location.search.indexOf('payment=false') !== -1) {
        if (!toggledErrMessOnce) {
            toggledErrMessOnce = true
            if (toggleMessages) {
                toggleMessages([{ type: 'error', message: Identify.__('An error occurred while making the transaction. Please try again.'), auto_dismiss: false }])
            }
        }
    }
    if (errors.length && toggleMessages) {
        errors.map(error => {
            toggleMessages([{ type: 'error', message: error, auto_dismiss: false }])
        })
    }

    let disableButtonCheckout = false
    if(cart && salesConfig && salesConfig.sales_minimum_order_active) {
        if(cart.prices && cart.prices.grand_total && cart.prices.grand_total.value > 0) {
            if(parseFloat(salesConfig.sales_minimum_order_amount) > parseFloat(cart.prices.grand_total.value)) {
                disableButtonCheckout = true;
                const message = (
                    <div>{Identify.__("Minimum order amount is")} {formatPrice(cart.prices.grand_total.value)}</div>
                )
                toggleMessages([{ type: 'error', message: message, auto_dismiss: false }])
            }
        }
    }

    const couponCode = () => {
        const childCPProps = {
            toggleMessages,
            setIsCartUpdating,
            defaultOpen: !isPhone
        }; 
        return (
            <div className="cart-coupon-form">
                <div className="cart-coupon-form-title1">{Identify.__('Apply Discount Code')}</div>
                <div className="cart-coupon-form-title2">{Identify.__('Enter discount code')}</div>
                <Coupon {...childCPProps} />
            </div>
        );
    }

    const handleGoCheckout = useCallback(() => {
        if(disableButtonCheckout) return
        if (errors && errors.length && errors[0])
            showToastMessage(errors[0])
        else if (!Identify.isEnabledCheckoutAsGuest() && !isSignedIn) {
            history.push('/login.html');
        } else
            history.push('/checkout.html');
    }, [cart, history, errors, disableButtonCheckout])

    if (isCartUpdating || shouldShowLoadingIndicator) {
        showFogLoading();
    } else {
        hideFogLoading();
    }

    if (!hasItems) {
        if (isCartUpdating) {
            return ''
        } else {
            return (
                <div className="cart-page">
                    <div className="empty-cart">
                        <EmptyCart />
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="container cart-page">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('Shopping Cart')
            })}
            <div className="cart-header">
                {hasItems ? (
                    <div className="cart-title">
                        <div>{Identify.__('Shopping cart')}</div>
                    </div>
                ) : ''}
            </div>
            <ProductListing setIsCartUpdating={(newValue) => {
                //if we're having an error, and updated something, need to reload the cart to clean the errors from apollo useQuery
                if (!newValue && isCartUpdating && errors && errors.length) {
                    window.location.reload();
                }
                setIsCartUpdating(newValue);
            }
            }
                isPhone={isPhone}
                cartCurrencyCode={cartCurrencyCode}
                history={history} />
            {isCartUpdating ? '' : (
                <div className="cart-footer row">
                    {
                        !isPhone && (
                            <div className="col-md-4">
                                {(cart && (!errors || !errors.length)) && couponCode()}
                            </div>
                        )
                    }
                    {
                        !isPhone && (
                            <div className="col-md-4">
                                {
                                    (cart && !cart.is_virtual && (!errors || !errors.length)) &&
                                    <Estimate />
                                }
                            </div>
                        )
                    }
                    <div className="col-md-4">
                        <div className="total-section">
                            <div className="total-section-title">{isPhone ? Identify.__('Summary') : Identify.__('Total')}</div>
                            {(isPhone && (!errors || !errors.length)) && couponCode()}
                            <div className="summary">
                                <PriceSummary isUpdating={isCartUpdating} />
                            </div>
                            <div className="cart-btn-section">
                                <Colorbtn
                                    id="go-checkout"
                                    className={`go-checkout ${disableButtonCheckout ? 'disable' : ''}`}
                                    disable={disableButtonCheckout}
                                    onClick={() => handleGoCheckout()}
                                    text={Identify.__('Proceed to checkout')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
