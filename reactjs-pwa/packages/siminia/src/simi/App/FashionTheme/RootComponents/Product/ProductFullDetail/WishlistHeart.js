import React from 'react';
import { useAddWishlist } from 'src/simi/talons/Wishlist/useAddWishlist';
import { showToastMessage } from 'src/simi/Helper/Message';
import Identify from 'src/simi/Helper/Identify';

export const WishlistHeart = (props) => {
    const { toggleMessages, params } = props || {};
    const {
        addWishlist,
        derivedErrorMessage
    } = useAddWishlist({ toggleMessages });

    if (derivedErrorMessage)
        showToastMessage(derivedErrorMessage)

    const addToWishlist = () => {
        if (params && params.product) {
            if (params.super_attribute) {
                addWishlist(params.product, JSON.stringify(params));
            } else {
                addWishlist(params.product);
            }
        } else {
            showToastMessage(Identify.__('Please select the options required (*)'));
        }
    }

    return (
        <div role="presentation" className="wishlist-actions" onClick={addToWishlist}>
            <span className="icon-heart" />
        </div>
    );
}

export default WishlistHeart;