import React from 'react';
import CartCounter from './cartCounter';
import Basket from "src/simi/App/FashionTheme/BaseComponents/Icon/Basket";
import { useCartTrigger } from 'src/simi/talons/Header/useCartTrigger'
import { connect } from 'src/drivers';
import { GET_CART_DETAILS as GET_CART_DETAILS_QUERY } from 'src/simi/App/core/Cart/cartPage.gql';
import { GET_ITEM_COUNT_QUERY } from './cartTrigger.gql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import { toggleDrawer } from 'src/actions/app';


const Trigger = props => {
    const { storeConfig, toggleDrawer } = props

    const { handleClick, itemCount: itemsQty } = useCartTrigger({
        mutations: {
            createCartMutation: CREATE_CART_MUTATION
        },
        queries: {
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        },
        storeConfig,
        toggleDrawer
    });

    const iconColor = '#000';
    const svgAttributes = {
        stroke: iconColor
    };

    if (itemsQty > 0) {
        svgAttributes.fill = iconColor;
    }

    return (
        <div>
            <div
                role="presentation"
                className='cart-trigger-root'
                onClick={handleClick}
            >
                <div className='item-icon' style={{ display: 'flex', justifyContent: 'center' }}>
                    <Basket style={{ display: 'block', margin: 0 }} />
                </div>
                <CartCounter counter={itemsQty ? itemsQty : 0} />
            </div>
        </div>
    )
}



const mapStateToProps = ({ simireducers }) => {
    const { storeConfig } = simireducers;
    return {
        storeConfig
    }
}

const mapDispatchToProps = {
    toggleDrawer
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Trigger);
