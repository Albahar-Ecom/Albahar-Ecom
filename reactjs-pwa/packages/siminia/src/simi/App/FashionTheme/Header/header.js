import React, { Suspense, useCallback, useMemo, useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import MenuIcon from 'src/simi/App/FashionTheme/BaseComponents/Icon/Menu';
import ToastMessage from 'src/simi/BaseComponents/Message/ToastMessage';
import ToastSuccess from 'src/simi/BaseComponents/Message/ToastSuccess';
import TopMessage from 'src/simi/BaseComponents/Message/TopMessage';
import NavTrigger from './LeftMenu/leftMenuTrigger';
import CartTrigger from './Cart/cartTrigger';
import { Link } from 'src/drivers';
import HeaderNavigation from './Menu/HeaderNavigation';
import MyAccount from './MyAccount';
import { useHistory, useLocation } from 'react-router-dom';
import { logoUrl } from 'src/simi/Helper/Url';
import Settings from "./Settings";
import SearchFormTrigger from './Search/SearchFormTrigger';
import MiniCart from 'src/simi/App/FashionTheme/MiniCart';
import { useWindowSize } from '@magento/peregrine';
require('./header.scss');

const SearchForm = React.lazy(() => import('./Search/SearchForm'));

const Header = props => {
    const { storeConfig } = props
    const history = useHistory()
    const location = useLocation()
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const [showSearchForm, setShowSearchForm] = useState(!isPhone)

    const toggleSearch = () => {
        setShowSearchForm(!showSearchForm)
    };

    const renderLogo = useMemo(() => (
        <div className='header-logo'>
            <div className="header-image">
                <Link to="/">
                    <img src={logoUrl()} alt={`Logo`} />
                </Link>
            </div>
        </div>
    ), []);

    const cartTrigger = useMemo(() => <CartTrigger />, [])

    const renderRightBar = useCallback(() => {
        return (
            <div className={`right-bar ${Identify.isRtl() ? 'rtl-right-bar' : ''}`}>
                <div className={'right-bar-item'} id="my-account">
                    <MyAccount />
                </div>
                <div className={`right-bar-item`} id="cart">
                    {cartTrigger}
                </div>
                <div className={`right-bar-item`} id="settings">
                    <Settings />
                </div>
            </div>
        );
    }, [cartTrigger]);

    const outerSearchComponent = useCallback((props) => {
        return (
            <div className={props.className} {...props}>
                {props.children}
            </div>
        );
    }, []);

    const simpleHeader = (location && location.pathname &&
        ((location.pathname.indexOf("/checkout.html") !== -1) || (location.pathname.indexOf("/cart.html") !== -1)))

    if (isPhone) {
        return (
            <React.Fragment>
                <div className={`header-wrapper mobile fixed`}>
                    <div className="container-header">
                        <div className="container-fluid">
                            <div className={`header ${Identify.isRtl() ? 'rtl-header' : ''}`}>
                                <NavTrigger >
                                    <MenuIcon className="mobile-menu-icon" color="#101820" />
                                </NavTrigger>
                                {renderLogo}
                                <div className={`right-bar ${Identify.isRtl() ? 'rtl-right-bar' : ''}`}>
                                    <div className={'right-bar-item'}>
                                        <SearchFormTrigger toggleSearch={toggleSearch} />
                                    </div>
                                    <div className={'right-bar-item cart'}>
                                        {cartTrigger}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Suspense fallback={null}>
                        <SearchForm
                            showSearchForm={showSearchForm}
                            setShowSearchForm={setShowSearchForm}
                            outerComponent={outerSearchComponent}
                            toggleSearch={toggleSearch}
                            history={history}
                            isPhone={true}
                        />
                    </Suspense>
                    <div id="id-message">
                        <TopMessage history={history}/>
                        <ToastMessage />
                        <ToastSuccess />
                    </div>
                </div>
                <div className="clone-header-wrapper-mobile"></div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <div className={`header-wrapper`}>
                <div className="container-header">
                    <div className="container sub-container">
                        <div className={`header ${Identify.isRtl() ? 'rtl-header' : ''}`}>
                            {
                                simpleHeader ? '' :
                                    <div className="header-search">
                                        <Suspense fallback={null}>
                                            <SearchForm
                                                showSearchForm={showSearchForm}
                                                setShowSearchForm={setShowSearchForm}
                                                toggleSearch={toggleSearch}
                                                history={history} />
                                        </Suspense>
                                    </div>
                            }
                            {renderLogo}
                            <HeaderNavigation />
                            {simpleHeader ? <div style={{ display: 'none' }}>{renderRightBar()}</div> : renderRightBar()}
                        </div>
                        {(!simpleHeader && storeConfig && storeConfig.simiStoreConfig) ? <MiniCart history={history} /> : ''}
                    </div>
                </div>
            </div>
            {simpleHeader ? '' : <HeaderNavigation addClassNames={'app-nav-main'} />}
            <div id="id-message">
                <TopMessage history={history}/>
                <ToastMessage />
                <ToastSuccess />
            </div>
        </React.Fragment>
    );
}

export default Header;
