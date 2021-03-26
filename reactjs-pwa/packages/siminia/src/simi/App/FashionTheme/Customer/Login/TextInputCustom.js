import React from 'react';
import { BasicText, asField } from 'informed';
require('./customInput.scss')

const TextInputCustom = asField(({ fieldState, ...props }) => {
    const basicTextProps = {...props}
    if (basicTextProps.icon_class)
        delete basicTextProps['iconClassName'];
    return (
        <React.Fragment>
            {props.icon_class && <i className={props.icon_class} style={fieldState.error ? { color: '#B91C1C' } : null}></i>}
            <BasicText
                fieldState={fieldState}
                {...basicTextProps}
                style={fieldState.error ? { border: 'solid 1px #B91C1C' } : null}
            />
            {fieldState.error ? (
                <p style={{ color: '#B91C1C' }}>{fieldState.error}</p>
            ) : null}
        </React.Fragment>
    )
});

export default TextInputCustom
