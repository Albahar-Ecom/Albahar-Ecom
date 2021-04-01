import { useCallback, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { simiUseMutation, simiUseAwaitQuery } from 'src/simi/Network/Query';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useSignIn = props => {
    const {
        createCartMutation,
        customerQuery,
        getCartDetailsQuery,
        mergeCartsMutation,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        signInMutation,
        signInSocialMutation
    } = props;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [
        { cartId },
        { createCart, removeCart, getCartDetails }
    ] = useCartContext();

    const [
        { isGettingDetails, getDetailsError },
        { getUserDetails, setToken }
    ] = useUserContext();

    const [signIn, { error: signInError }] = simiUseMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const [signInSocial, { error: signInSocialError }] = simiUseMutation(signInSocialMutation, {
        fetchPolicy: 'no-cache'
    });
    
    const [fetchCartId] = simiUseMutation(createCartMutation);
    const [mergeCarts] = simiUseMutation(mergeCartsMutation);
    const fetchUserDetails = simiUseAwaitQuery(customerQuery);
    const fetchCartDetails = simiUseAwaitQuery(getCartDetailsQuery);

    const errors = [];
    if (signInError) {
        errors.push(signInError.graphQLErrors[0]);
    }
    if (getDetailsError) {
        errors.push(getDetailsError);
    }
    if (errors.length > 0) {
        hideFogLoading();
    }

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            showFogLoading();
            setIsSigningIn(true);
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                await getUserDetails({ fetchUserDetails });

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                if (sourceCartId && destinationCartId) {
                    await mergeCarts({
                        variables: {
                            destinationCartId,
                            sourceCartId
                        }
                    });
                }
                hideFogLoading();

                // Ensure old stores are updated with any new data.
                getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                hideFogLoading();
                setIsSigningIn(false);
            }
        },
        [
            cartId,
            apolloClient,
            removeCart,
            signIn,
            setToken,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    const handleSocialLogin = useCallback(
        async ({ email, id, lastName, firstName }) => {
            showFogLoading();
            try {
                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                const signInResponse = await signInSocial({
                    variables: { email, id, lastName, firstName }
                });

                const token = signInResponse.data.socialGenerateCustomerToken.token;

                await setToken(token);

                //renew notification token with customer id
                // if (window.simifcm && window.simifcm.token) {
                //     try {
                //         await window.simifcm.ensureSubscription()
                //     } catch (err) {
                //         console.warn(err)
                //     }
                // }
                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                await getUserDetails({ fetchUserDetails });

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                if (sourceCartId && destinationCartId) {
                    await mergeCarts({
                        variables: {
                            destinationCartId,
                            sourceCartId
                        }
                    });
                }
                hideFogLoading();

                // Ensure old stores are updated with any new data.
                getCartDetails({ fetchCartId, fetchCartDetails });

                // save remember me
                if (isCheckRemember) {
                    // Encode password
                    const objCookie = {
                        'email': email,
                        'hash': ''
                    }
                    cookies.set('authenticate', objCookie, { path: '/' });
                }

                history.push('/');
                
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                hideFogLoading();
            }
        }, [
        cartId,
        apolloClient,
        removeCart,
        signInSocial,
        setToken,
        createCart,
        fetchCartId,
        mergeCarts,
        getUserDetails,
        fetchUserDetails,
        getCartDetails,
        fetchCartDetails,
    ]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSocialLogin,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
