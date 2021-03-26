import React from 'react';
import { connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify'
import TitleHelper from 'src/simi/Helper/TitleHelper'
import Item from "./Item";
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { getCartDetails } from 'src/actions/cart';
import Pagination from 'src/simi/App/FashionTheme/BaseComponents/Pagination';
import Loading from 'src/simi/BaseComponents/Loading'
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useWishlist } from 'src/simi/talons/Wishlist/useWishlist';

require("./index.scss");

const Wishlist = props => {
    const { history, toggleMessages, getCartDetails} = props

    const {
        data,
        isLoading,
        addToCart,
        deleteItem
    } = useWishlist({toggleMessages});

    const renderItem = (item, index) => {
        return (
            <div
                key={`${item.id}-${index}`}
                className={`siminia-wishlist-item`}
            >
                <Item
                    item={item}
                    lazyImage={true}
                    showBuyNow={true}
                    addWishlistToCart={addToCart}
                    removeItem={deleteItem}
                    toggleMessages={toggleMessages}
                    getCartDetails={getCartDetails}
                    history={history}
                />
            </div>
        )
    }

    let rows = null
    if (data && data.items) {
        const {items, items_count} = data;
        if (items_count && items && items.length) {
            rows = (
                <Pagination
                    data={items}
                    renderItem={renderItem}
                    itemsPerPageOptions={[8, 16, 32]}
                    showItemPerPage={false}
                    showInfoItem={false}
                    limit={12}
                    itemCount={items_count}
                    changedPage={()=>smoothScrollToView($('#root'))}
                    changeLimit={()=>smoothScrollToView($('#root'))}
                />
            )
        }
    } else {
        rows = <Loading />
    }
    return (
        <div className="account-my-wishlist">
            {TitleHelper.renderMetaHeader({
                    title:Identify.__('My Wish List')
            })}
            <div className="customer-page-title">
                {Identify.__("My Wish List")}
            </div>
            <div className="my-wishlist-grid">
                {rows ? rows : (
                    <div className="no-product">
                        <p>
                            {Identify.__(
                                "There are no products matching the selection"
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
    getCartDetails
}
export default connect(
    null,
    mapDispatchToProps
)(Wishlist);
