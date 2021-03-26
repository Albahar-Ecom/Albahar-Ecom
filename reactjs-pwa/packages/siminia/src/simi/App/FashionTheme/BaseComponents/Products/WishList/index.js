import React, { Fragment } from 'react';
import { Link, connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import WishListItem from './item';
import { useWishlist } from 'src/simi/talons/Wishlist/useWishlist';

require('./wishlist.scss')

const WishList = (props) => {
    const { toggleMessages } = props;
    // const [data, setData] = useState(null)

    const {
        data,
        isLoading,
        addToCart,
        deleteItem
    } = useWishlist({ toggleMessages });

    if (!data) return null;

    if (data && data.items && data.items.length === 0) {
        return <div className="no-item">
            {Identify.__('You have no items in your wish list')}
        </div>
    }

    return (
        <Fragment>
            <div className="wishlist-top-title sidebar">
                <div className="title">{Identify.__('my wish list')}</div>
                <div className="count-item">( {data.items_count} {Identify.__('items ')} )</div>
            </div>
            {data && data.items ?
                data.items.slice(0, 5).map((item, index) => (
                    <WishListItem
                        key={index}
                        item={item}
                        addToCart={addToCart}
                        removeItem={deleteItem}
                        history={props.history}
                    />
                )) : ''}
            {data && data.items && data.items.length ?
                <div className="view-all" role="presentation" onClick={() => smoothScrollToView($('#root'))}>
                    <Link to={'/wishlist.html'}>
                        {Identify.__('View All')}
                    </Link>
                </div> : ''}
        </Fragment>
    )
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(WishList);
