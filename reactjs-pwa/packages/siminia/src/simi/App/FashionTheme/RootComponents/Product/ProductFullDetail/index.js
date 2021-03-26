import ProductFullDetail from './ProductFullDetail';
import { compose } from 'redux';
import { connect, withRouter } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    toggleMessages
};

const mapStateToProps = ({ user, cart }) => {
    const { isSignedIn, currentUser } = user;
    const { cartId } = cart
    return {
        isSignedIn,
        cartId,
        currentUser
    };
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(ProductFullDetail);
