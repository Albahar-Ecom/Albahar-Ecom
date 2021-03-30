import React, { Component } from 'react';
import Minus from 'src/simi/BaseComponents/Icon/Minus'
import Plus from 'src/simi/BaseComponents/Icon/Add'

require('./qty.scss')

const Quantity = props => {
    return (
        <div className="grid-item-quantity">
            <div className="btn-plus">
                <Minus style={{ width: 20, height: 20, fill: '#FFFFFF'}} />
            </div>
            <input type="text" className="quantity-input"/>
            <div className="btn-minus">
                <Plus style={{ width: 20, height: 20, fill: '#FFFFFF'}}/>
            </div>
        </div>
    );
    
}

export default Quantity;