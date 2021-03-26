import React from 'react';

const CartCounter = props => {
    const { counter } = props;
    return counter > 0 ? (
        <span className="cart-counter-root"><span>{counter}</span></span>
    ) : '';
}

export default CartCounter;
