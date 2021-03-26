import React from "react";
import {defaultStyle} from 'src/simi/BaseComponents/Icon/Consts'

const ChevronCircleUp = props => {
    const color = props.color ? {fill: props.color} : {};
    const style = {...defaultStyle, ...props.style, ...color}

    return (
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-circle-up" className="svg-inline--fa fa-chevron-circle-up fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={style}>
            <path fill="currentColor" d="M8 256C8 119 119 8 256 8s248 111 248 248-111 248-248 248S8 393 8 256zm231-113.9L103.5 277.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L256 226.9l101.6 101.6c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L273 142.1c-9.4-9.4-24.6-9.4-34 0z" />
        </svg>
    );
}

export default ChevronCircleUp;