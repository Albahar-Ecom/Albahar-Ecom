import React, { useState, useEffect } from 'react';
import { func, string } from 'prop-types';
import classes from './navigation.css'
import Identify from 'src/simi/Helper/Identify'
import Dashboardmenu from './Dashboardmenu'
import { withRouter } from 'react-router-dom';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import { useApolloClient } from '@apollo/client';
import { simiUseMutation, simiUseAwaitQuery, simiUseAwaitQuery as useAwaitQuery } from 'src/simi/Network/Query';
import { useWindowSize } from '@magento/peregrine';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const queries = {
    getCartDetailsQuery: GET_CART_DETAILS_QUERY,
    createCartMutation: CREATE_CART_MUTATION
}
const Navigation = props => {
    const [, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(GET_CUSTOMER_QUERY);
    const { cartId, storeConfig, getCartDetails } = props
    const [fetchCartId] = simiUseMutation(queries.createCartMutation);
    const fetchCartDetails = simiUseAwaitQuery(queries.getCartDetailsQuery);

    // request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

    // siminote - no need to create cart cause it's created from cartContext peregrine/lib/context/cart.js?1956
    // const apolloClient = useApolloClient();
    // useEffect(() => {
    //     if (!cartId && storeConfig && storeConfig.simiStoreConfig) {
    //        getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    //     }
    // }, [apolloClient, fetchCartDetails, fetchCartId, getCartDetails, cartId, storeConfig]);

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;


    const renderDashboardMenu = (className) => {
        return (
            <Dashboardmenu
                className={className}
                classes={classes}
                history={props.history}
                isPhone={isPhone}
            />
        )
    }

    const {
        drawer,
    } = props;
    const isOpen = drawer === 'nav';
    const className = Identify.isRtl() ? (isOpen ? classes.rtl_root_open : classes.rtl_root) : (isOpen ? classes.root_open : classes.root)
    const simicartConfig = Identify.getAppDashboardConfigs()
    if (simicartConfig) {
        const dbMenu = renderDashboardMenu(className)
        if (dbMenu)
            return dbMenu
    }
    return ''
}

Navigation.propTypes = {
    closeDrawer: func.isRequired,
    drawer: string,
    createCart: func.isRequired,
    getCartDetails: func.isRequired,
};

export default (withRouter)(Navigation);
