import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import Identify from 'src/simi/Helper/Identify';
import Product from 'src/simi/App/FashionTheme/RootComponents/Product';

require('./styles.scss');

const QuickView = (props) => {
    const { closeModal, product, openModal } = props;

    let dataProduct = product;
    let urlKeyItem = null;
    if (product && product.hasOwnProperty('type_id') && product.type_id === 'simple' && (!product.hasOwnProperty('options'))) {
        // is simple product without custom option

    } else {
        dataProduct = null;
        urlKeyItem = product.hasOwnProperty('url_key') ? product.url_key : null;
    }

    return (
        <Modal modalId="modal-quick-view" overlayId="modal-quick-view-overlay" open={openModal} onClose={closeModal} classNames={{ overlay: Identify.isRtl() ? "rtl-quickview" : "" }}>
            <div className="modal-quick-view-inner">
                <Product preloadedData={dataProduct} isQuickView={true} urlKeyItem={urlKeyItem} />
            </div>
        </Modal>
    )
}

QuickView.propTypes = {
    closeModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool,
    product: PropTypes.object
}

export default QuickView;

