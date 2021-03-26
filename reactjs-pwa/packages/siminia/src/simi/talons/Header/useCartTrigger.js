import { useCallback, useEffect } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useWindowSize } from '@magento/peregrine';
import { useHistory } from 'react-router-dom';

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery },
        storeConfig,
        isBasicTheme
    } = props;
    const history = useHistory()
    const apolloClient = useApolloClient();
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [{ cartId }, { getCartDetails }] = useCartContext();
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            cartId
        },
        skip: !cartId
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const itemCount = (data && data.cart) ? data.cart.total_quantity : 0;

    useEffect(() => {
        // Passing apolloClient to wipe the store in event of auth token expiry
        // This will only happen if the user refreshes.
        // siminote - no need to create cart cause it's created from cartContext peregrine/lib/context/cart.js?1956
        if (cartId)
            getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    }, [apolloClient, fetchCartDetails, fetchCartId, getCartDetails, storeConfig]);

    const handleClick = useCallback(async () => {
        if (isBasicTheme && history) {
            history.push('/cart.html');
        } else if (isPhone && history)
            history.push('/cart.html');
        else
            toggleDrawer('cart')
    }, [history, isPhone, toggleDrawer, isBasicTheme]);

    return {
        handleClick,
        itemCount,
        isPhone
    };
};
