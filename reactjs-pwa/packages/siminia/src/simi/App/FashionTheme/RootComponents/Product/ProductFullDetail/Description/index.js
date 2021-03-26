import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import RichText from 'src/simi/BaseComponents/RichText';

require('./description.scss')

const Description = props => {
    const { description } = props;
    return (
        <React.Fragment>
            <h2 className="description-title">
                <span>{Identify.__('Description')}</span>
            </h2>
            <RichText className="description-content" content={description.html} />
        </React.Fragment>
    )
}

export default Description
