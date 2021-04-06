import React from 'react';
import ReactDOMServer from 'react-dom/server';
import GoogleIcon from 'src/simi/App/AlBahar/BaseComponents/Icon/Google';

const GoogleHoc = (props) => {
    const isNullChildren = !Boolean(ReactDOMServer.renderToStaticMarkup(props.children));
    if (!isNullChildren) {
        return props.children;
    }
    return <GoogleIcon style={{ width: 20, height: 20 }} />
}

export default GoogleHoc;