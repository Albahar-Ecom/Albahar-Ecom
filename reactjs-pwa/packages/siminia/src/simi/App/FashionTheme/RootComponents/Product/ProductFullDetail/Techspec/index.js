import React from 'react';
import Identify from 'src/simi/Helper/Identify';

require('./techspec.scss');

const Techspec = props => {
    const { product } = props
    if (product && product.simiExtraField && product.simiExtraField.additional) {
        const additional = product.simiExtraField.additional;
        const techSpecItems = [];
        for (const i in additional) {
            const additional_detail = additional[i];
            if (additional_detail.value) {
                techSpecItems.push(
                    <div className="tspecitem" key={i}>
                        <div className="tspecitemtitle">
                            {additional_detail.label}
                        </div>
                        <div className="tspecitemvalue">
                            {additional_detail.value}
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className="techspec">
                <h2 className="title">
                    <span>{Identify.__('Additional Information')}</span>
                </h2>
                {techSpecItems}
            </div>
        )
    }
    return ''
}
export default Techspec
