import Main from './main';
import { setStoreConfig } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';

const mapDispatchToProps = { setStoreConfig };

export default connect(
    null,
    mapDispatchToProps
)(Main);