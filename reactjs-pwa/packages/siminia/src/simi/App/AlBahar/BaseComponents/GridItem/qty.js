import React, { useCallback, useMemo, useState } from 'react';
import Minus from 'src/simi/BaseComponents/Icon/Minus'
import Plus from 'src/simi/BaseComponents/Icon/Add'

require('./qty.scss')

const Quantity = props => {
    const {handleSetQty, isOutOfStock, isPhone} = props

    const [qty, setQty] = useState(1)

    const handleUpdateQty = useCallback((value) => {
        if(isOutOfStock) return;
        
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
    
    const sizeIcon = useMemo(() => {
        if(isPhone) {
            return {width: 16, height: 16}
        }

        return { width: 20, height: 20 }
    })

    return (
        <div className={`grid-item-quantity ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="btn-minus" onClick={() => handleUpdateQty('minus')}>
                <Minus style={{ ...sizeIcon, fill: '#FFFFFF'}} />
            </div>
            <input type="text" disabled={isOutOfStock} className="quantity-input" value={qty} onChange={e => handleUpdateQty(e.target.value)}/>
            <div className="btn-plus" onClick={() => handleUpdateQty('plus')}>
                <Plus style={{ ...sizeIcon, fill: '#FFFFFF'}}/>
            </div>
        </div>
    );
    
}

export default Quantity;