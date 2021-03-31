import { useCallback } from 'react';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { useWindowSize } from '@magento/peregrine';
import Identify from 'src/simi/Helper/Identify';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useGridItem = props => {
    const {
        updateCompare,
        handleLink,
        cartId,
        location,
        toggleMessages,
        mutations: { addSimpleToCartMutation }
    } = props;

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;


    const [addCart, { error: addCartError, loading: loading }] = useMutation(addSimpleToCartMutation);

    const handleAddCart = useCallback(
        async (item, quantity = 1) => {
            const {stock_status} = item

            if(stock_status === "OUT_OF_STOCK") return
            
            if (item.type_id === 'simple' && (!item.hasOwnProperty('options') || (item.hasOwnProperty('options') && item.options === null))) {
                showFogLoading();
                try {
                    await addCart({
                        variables: {
                            cartId,
                            sku: item.sku,
                            quantity
                        }
                    });
                    hideFogLoading();
                    toggleMessages([{ type: 'success', message: Identify.__("Add product to cart successfully!"), auto_dismiss: true }]);
                } catch (error) {
                    hideFogLoading();
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(error);
                    }
                }
            } else {
                handleLink(location);
            }
        }, []);

    let derivedErrorMessage;
    if (addCartError) {
        if (addCartError.graphQLErrors) {
            derivedErrorMessage = addCartError.graphQLErrors.map(({ message }) => message).join(', ');
        } else {
            derivedErrorMessage = addCartError.message;
        }
    }

    return {
        isPhone,
        handleAddCart,
        loading,
        derivedErrorMessage
    };
}
