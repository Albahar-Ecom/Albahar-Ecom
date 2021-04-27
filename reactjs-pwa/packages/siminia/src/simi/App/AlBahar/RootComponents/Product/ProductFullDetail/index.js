import ProductFullDetail from './ProductFullDetail';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';

const mapDispatchToProps = {
    toggleMessages,
    setSimiNProgressLoading
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
