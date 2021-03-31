import React from "react";
import {defaultStyle} from 'src/simi/BaseComponents/Icon/Consts'

const ChevronCircleUp = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style={style} xmlSpace="preserve">
            <title>Slice</title>
            <g id="Page-1">
                <g id="Group-3-Copy-6">
                <g className="st0">
                    <path d="M15.4,7l-4.6,4.6l4.6,4.6L14,17.6l-6-6l6-6L15.4,7z" />
                </g>
                </g>
            </g>
        </svg>



    );
}

export default ChevronCircleUp;