import React from "react";
import { defaultStyle } from 'src/simi/BaseComponents/Icon/Consts';

const Facebook2 = props => {
    const color = props.color ? { fill: props.color } : {};
    const style = { ...defaultStyle, ...props.style, ...color }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            style={style}
            className={props.className ? props.className : ''}
        >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g fill={props.fill ? props.fill : "#000"} fillRule="nonzero" transform="translate(-486 -220)">
                    <g transform="translate(494 220)">
                        <path d="M13.079 5.313H16V.225C15.496.156 13.763 0 11.744 0 7.533 0 4.648 2.65 4.648 7.519V12H0v5.688h4.648V32h5.698V17.69h4.46L15.512 12h-5.169V8.083c.002-1.644.444-2.77 2.735-2.77z"></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default Facebook2