import React from 'react';

const MiniCartMask = props => {
    const { dismiss, isActive } = props;
    return <button className={`minicart_mask_root ${isActive && 'mask_active'}`} onClick={dismiss} />
}

export default MiniCartMask;
