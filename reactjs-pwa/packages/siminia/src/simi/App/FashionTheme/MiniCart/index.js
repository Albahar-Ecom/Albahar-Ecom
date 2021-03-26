import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useMiniCart } from 'src/simi/talons/MiniCart/useMiniCart';
import Identify from 'src/simi/Helper/Identify';
import EmptyCart from 'src/simi/App/core/Cart/EmptyCart';
import Mask from './mask';
import Total from 'src/simi/BaseComponents/Total'
import { Link } from 'react-router-dom';
import CartItem from 'src/simi/App/core/Cart/ProductListing/CartItem';
import { GET_CART_DETAILS } from 'src/simi/App/core/Cart/cartPage.gql';
import Loading from 'src/simi/BaseComponents/Loading';

require('./minicart.scss');

const MiniCart = props => {
    const { history } = props

    const talonProps = useMiniCart({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });

    const {
        hasItems,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        cart,
        closeDrawer,
        isOpen,
        activeEditItem,
        setActiveEditItem,
    } = talonProps;

    const cartCurrencyCode = (cart && cart.prices && cart.prices.grand_total && cart.prices.grand_total.currency)

    const handleLink = useCallback((link) => {
        history.push(link);
    }, [history])

    const productList = () => {
        const { items } = cart
        const obj = items.map(item => {
            if (item)
                return (
                    <CartItem
                        key={item.id}
                        item={item}
                        currencyCode={cartCurrencyCode}
                        handleLink={handleLink}
                        history={history}
                        miniOrMobile={true}
                        setIsCartUpdating={setIsCartUpdating}
                        setActiveEditItem={setActiveEditItem}
                    />
                )
        })
        return <div className="cart-list">{obj}</div>;
    }


    const title = !hasItems ? '' : Identify.__('My Cart')

    const className = `${Identify.isRtl() && 'minicart_nav_rtl'} ${isOpen && 'open'}`;

    return (
        <>
            <aside className={`${className} minicart_root ${hasItems ? '' : 'empty_minicart'}`} >
                <div className="minicart_header">
                    <h2>
                        <span>{title}</span>
                    </h2>
                    <i className="icon-cross" role="presentation" onClick={closeDrawer} />
                </div>
                {(isCartUpdating || shouldShowLoadingIndicator) ? <div className="minicart_loading_overlay"><Loading /></div> : ''}
                {
                    (cart && hasItems) ? (
                        <div className="minicart_inner">
                            <div className="minicart_productlist">
                                {productList()}
                            </div>
                            <div className="minicart_footer">
                                <div className="summary">
                                    {(cart && cart.prices) ? <Total prices={cart.prices} currencyCode={cartCurrencyCode} /> : ''}
                                    <div className="minicartAction">
                                        <Link to="/cart.html" onClick={() => {
                                            closeDrawer();
                                            document.body.classList.remove('minicart-open');
                                        }}>
                                            <button className={`mini-cart-view-cart-btn viewCartBtn`}>
                                                {Identify.__('VIEW AND EDIT CART')}
                                            </button>
                                        </Link>
                                        <div role="presentation" onClick={() => {
                                            history.push('/checkout.html');
                                            closeDrawer();
                                            document.body.classList.remove('minicart-open');
                                        }}>
                                            <button className="checkoutBtn">
                                                {Identify.__('GO TO CHECKOUT')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <EmptyCart history={history} handleClickOutside={closeDrawer} />
                }
            </aside>
            <Mask isActive={isOpen} dismiss={closeDrawer} />
        </>
    );
};

export default MiniCart;
