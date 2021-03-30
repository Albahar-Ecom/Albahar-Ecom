import React, { useCallback, useState } from 'react';
import Minus from 'src/simi/BaseComponents/Icon/Minus'
import Plus from 'src/simi/BaseComponents/Icon/Add'

require('./qty.scss')

const Quantity = props => {
    const {handleSetQty} = props

    const [qty, setQty] = useState(1)

    const handleUpdateQty = useCallback((value) => {
        let newQty = qty
        if(value === 'plus') {
            if(!isNaN(qty)) {
                newQty += 1
            } 
        } else if (value === 'minus') {
            if(!isNaN(newQty) && newQty > 1) {
                newQty -= 1
            }
        } else {
            if (value.trim() === '' || (!isNaN(value) && value >= 1)) {
                newQty = value
            }
        }

        setQty(newQty)
        handleSetQty(newQty)
    })

    return (
        <div className="grid-item-quantity">
            <div className="btn-minus" onClick={() => handleUpdateQty('minus')}>
                <Minus style={{ width: 20, height: 20, fill: '#FFFFFF'}} />
            </div>
            <input type="text" className="quantity-input" value={qty} onChange={e => handleUpdateQty(e.target.value)}/>
            <div className="btn-plus" onClick={() => handleUpdateQty('plus')}>
                <Plus style={{ width: 20, height: 20, fill: '#FFFFFF'}}/>
            </div>
        </div>
    );
    
}

export default Quantity;