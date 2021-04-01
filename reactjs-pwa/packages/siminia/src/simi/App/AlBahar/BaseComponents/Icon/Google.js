import React from "react";
import { defaultStyle } from 'src/simi/BaseComponents/Icon/Consts';

const Google = props => {
    const color = props.color ? { fill: props.color } : {};
    const style = { ...defaultStyle, ...props.style, ...color }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            style={style}
            className={props.className ? props.className : ''}
        >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g fillRule="nonzero" transform="translate(-377 -45)">
                    <g transform="translate(377 45)">
                        <path
                            fill="#167EE6"
                            d="M19.245 8.261h-8.158a.652.652 0 00-.652.652v2.606c0 .36.292.652.652.652h4.594a6.133 6.133 0 01-2.64 3.094L15 18.655c3.142-1.816 5-5.005 5-8.575a6.61 6.61 0 00-.112-1.28.655.655 0 00-.643-.539z"
                        ></path>
                        <path
                            fill="#12B347"
                            d="M10 16.087a6.086 6.086 0 01-5.265-3.046l-3.39 1.954A9.987 9.987 0 0015 18.66v-.004l-1.959-3.391a6.041 6.041 0 01-3.041.822z"
                        ></path>
                        <path
                            fill="#0F993E"
                            d="M15 18.66v-.004l-1.959-3.391a6.042 6.042 0 01-3.041.822V20a9.983 9.983 0 005-1.34z"
                        ></path>
                        <path
                            fill="#FFD500"
                            d="M3.913 10c0-1.108.302-2.145.822-3.04l-3.39-1.955A9.896 9.896 0 000 10c0 1.819.488 3.526 1.344 4.995l3.391-1.954A6.042 6.042 0 013.913 10z"
                        ></path>
                        <path
                            fill="#FF4B26"
                            d="M10 3.913c1.466 0 2.813.521 3.865 1.388a.65.65 0 00.874-.04l1.846-1.846a.657.657 0 00-.037-.961A9.97 9.97 0 0010 0a9.987 9.987 0 00-8.656 5.005l3.391 1.954A6.086 6.086 0 0110 3.913z"
                        ></path>
                        <path
                            fill="#D93F21"
                            d="M13.865 5.3a.65.65 0 00.874-.039l1.846-1.846a.657.657 0 00-.037-.961A9.97 9.97 0 0010 0v3.913c1.466 0 2.813.521 3.865 1.388z"
                        ></path>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default Google;