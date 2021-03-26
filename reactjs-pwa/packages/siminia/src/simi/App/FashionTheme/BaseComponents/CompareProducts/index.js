import React from 'react';
import Modal from 'react-responsive-modal';
import Identify from 'src/simi/Helper/Identify';
import CompareProductInner from './CompareProductInner';

require('./styles.scss');

const CompareProduct = props => {
    const { openModal, closeModal, history, isSignedIn, compareData, updateCompare, updateWishlist } = props;
    return (
        <Modal
            modalId="modal-compare"
            overlayId="modal-compare-overlay"
            open={openModal}
            onClose={closeModal}
            classNames={{ overlay: Identify.isRtl() ? "rtl-root-modal" : "" }}
        >
            <div className="top">
                <div className="title">
                    {Identify.__("My Compare Products")}
                </div>
                <div className="back" role="presentation" onClick={() => closeModal()}>
                    {Identify.__("back")}
                </div>
            </div>
            <div className="modal-compare-inner">
                <CompareProductInner
                    history={history}
                    isSignedIn={isSignedIn}
                    compareData={compareData}
                    updateCompare={updateCompare}
                    updateWishlist={updateWishlist}
                />
            </div>
        </Modal>
    );
};

export default CompareProduct;
