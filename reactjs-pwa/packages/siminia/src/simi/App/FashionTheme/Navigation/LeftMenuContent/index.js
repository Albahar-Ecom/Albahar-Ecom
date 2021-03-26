import React from 'react'
import Identify from "src/simi/Helper/Identify"
import CateTree from 'src/simi/App/core/Navigation/Dashboardmenu/CateTree'
import LeftMenuAccount from './LeftMenuAccount';
import Storeview from "src/simi/BaseComponents/Settings/Storeview/index";
import Currency from "src/simi/BaseComponents/Settings/Currency/index"
import { toggleDrawer, closeDrawer } from 'src/actions/app';
import { connect, withRouter } from 'src/drivers';
import { compose } from 'redux';

const LeftMenuContent = props => {
    const { history, hideNav, isSignedIn } = props;

    const merchantConfigs = Identify.getStoreConfig();

    const handleLink = (link) => {
        history.push(link);
        if (hideNav) {
            hideNav();
        }
    }

    const handleMenuItem = (item) => {
        if (item && item.url) {
            handleLink(item.url)
        } else if (item && item.pathname) {
            handleLink(item)
        }
    }

    const renderSections = <React.Fragment>
        <div className="left-cats-menu">
            <CateTree classes={{
                'menu-content': 'menu-content',
                'icon-menu': 'icon-menu',
                'menu-title': 'menu-title',
                'menu-cate-name-item': 'menu-cate-name-item',
                'root-menu': 'root-menu',
                'cate-parent-item': 'cate-parent-item',
                'sub-cate-root': 'sub-cate-root',
                'cate-child-item': 'cate-child-item',
                'cate-icon': 'cate-icon',
                'cate-root': 'cate-root',
            }}
                handleMenuItem={handleMenuItem} hideHeader={false} />
        </div>
        {isSignedIn && <LeftMenuAccount handleMenuItem={handleMenuItem} />}
        {merchantConfigs &&
            <div className="left-store-switch">
                <div className="storeview-switcher">
                    <Storeview classes={{}} className="storeview" />
                </div>
                <div className="currency-switcher">
                    <Currency classes={{}} className="currency" />
                </div>
            </div>
        }
        <div className="left-contact-us">
            {Identify.__('Contact us 24/7: 84 - 24 - 6651 - 7968 (GMT+7)')}
        </div>

        {!isSignedIn && <div className="left-bottom-menu">
            <div role="presentation"
                className="left-bottom-menu-login-btn"
                onClick={() => handleLink('/login.html')}>
                {Identify.__('Login')}
            </div>
        </div>
        }
    </React.Fragment>

    return (
        <div className="list-menu-header" style={{ maxHeight: window.innerHeight }}>
            <div className="left-top-menu">
                {renderSections}
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    openNav: () => dispatch(toggleDrawer('nav')),
    hideNav: () => dispatch(closeDrawer('nav'))
});

export default compose(connect(null, mapDispatchToProps), withRouter)(LeftMenuContent);
