import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = props => {
    const { title, icon, divider, menuStyle, iconStyle, titleStyle, onClick } = props;

    return (
        <div className={`menu-item-wrap ${divider ? 'divider' : ''} menu-item`}>
            <div role="presentation" style={menuStyle} onClick={onClick}>
                <div className={'menu-content'}>
                    {icon &&
                        <div className={'icon-menu'} style={iconStyle}>
                            {icon}
                        </div>
                    }
                    <div className={'menu-title'} style={titleStyle}>
                        {title}
                    </div>
                </div>
            </div>
        </div>
    )
}

MenuItem.defaultProps = {
    title: '',
    icon: '',
    divider: true,
    menuStyle: {},
    titleStyle: {},
    iconStyle: {},
    onClick: function () { }
}
MenuItem.propsTypes = {
    title: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    icon: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.node,
        PropTypes.string,
    ]),
    divider: PropTypes.bool,
    menuStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    iconStyle: PropTypes.object,
    onClick: PropTypes.func
}
export default MenuItem;
