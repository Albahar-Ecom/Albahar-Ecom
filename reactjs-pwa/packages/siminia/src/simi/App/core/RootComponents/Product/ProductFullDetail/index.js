import ProductFullDetail from './ProductFullDetail';

import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    toggleMessages
};

const mapStateToProps = ({ cart }) => {
    const { cartId } = cart
    return {
        cartId
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductFullDetail);
