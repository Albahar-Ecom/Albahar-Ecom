import React from "react";
import {defaultStyle} from 'src/simi/BaseComponents/Icon/Consts'

const ChevronRight = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style={style} xmlSpace="preserve">
            <title>Slice Copy</title>
            <g id="Page-1">
                <g id="Group-3-Copy-7" transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) ">
                <g className="st0">
                    <path d="M14,5.6l-6,6l6,6l1.4-1.4l-4.6-4.6L15.4,7L14,5.6z" />
                </g>
                </g>
            </g>
        </svg>

    );
}

export default ChevronRight;