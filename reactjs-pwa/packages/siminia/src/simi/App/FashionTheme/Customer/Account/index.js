import React, { useState, useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Identify from 'src/simi/Helper/Identify';
import BreadCrumb from 'src/simi/App/FashionTheme/BaseComponents/BreadCrumb';
import Dashboard from './Page/Dashboard';
import Wishlist from './Page/Wishlist';
import Newsletter from './Page/Newsletter';
import AddressBook from './Page/AddressBook';
import NewAddressBook from './Page/AddressBook/NewAddress';
import Profile from './Page/Profile';
import MyOrder from './Page/OrderHistory';
import OrderDetail from './Page/OrderDetail';
import CompareProduct from './Page/CompareProduct';
import { useWindowSize } from '@magento/peregrine';
import { useMyDashboard } from 'src/simi/talons/MyAccount/useMyDashboard';
require('./style.scss');

const menuConfig = [
    {
        title: Identify.__('My Account'),
        url: '/account.html',
        page: 'dashboard',
        enable: true,
        sort_order: 10
    },
    {
        title: Identify.__('My Orders'),
        url: '/orderhistory.html',
        page: 'my-order',
        enable: true,
        sort_order: 20
    },
    {
        title: Identify.__('Account Information'),
        url: '/profile.html',
        page: 'edit-account',
        enable: true,
        sort_order: 30
    },
    {
        title: Identify.__('Newsletter'),
        url: '/newsletter.html',
        page: 'newsletter',
        enable: true,
        sort_order: 40
    },
    {
        title: Identify.__('Address Book'),
        url: '/addresses.html',
        page: 'address-book',
        enable: true,
        sort_order: 50
    },
    {
        title: Identify.__('My WishList'),
        url: '/wishlist.html',
        page: 'wishlist',
        enable: true,
        sort_order: 60
    },
    {
        title: Identify.__('My Compare Products'),
        url: '/my-compare-products.html',
        page: 'compare-products',
        enable: true,
        sort_order: 70
    },
    {
        title: Identify.__('Log out'),
        url: '/logout.html',
        page: 'home',
        enable: true,
        sort_order: 110
    }
];

const CustomerLayout = props => {
    const { history,/*  firstname, lastname, email, isSignedIn, */ match } = props;


    const [page, setPage] = useState('dashboard');
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const talonProps = useMyDashboard({});
    const { firstname, lastname, email, isSignedIn } = talonProps;

    if (!isSignedIn) {
        history.push('/login.html');
    }

    useEffect(() => {
        $('body').addClass('body-customer-dashboard');
        return () => {
            $('body').removeClass('body-customer-dashboard');
        };
    }, []);

    const handleLink = (link) => {
        history.push(link)
    };

    if (props.page !== page) {
        // page changed since last render. Update isScrollingDown.
        setPage(props.page);
    }

    const redirectExternalLink = (url) => {
        if (url) {
            Identify.windowOpenUrl(url)
        }
        return null;
    }

    const renderMenu = () => {

        const menu = menuConfig.filter(({ enable }) => enable === true).map((item, idx) => {
            const active = item.page.toString().indexOf(page) > -1 || (page === 'order-detail' && item.page === 'my-order') || (page === 'new-address-book' && item.page === 'address-book') ? 'active' : '';

            return (
                <MenuItem key={idx} onClick={() => handleLink(item.url)} className={`customer-menu-item ${item.page} ${active}`}>
                    <div className="menu-item-title">
                        {Identify.__(item.title)}
                    </div>
                </MenuItem>
            );
        }, this);

        return (
            <div className="dashboard-menu">
                <div className="menu-header">
                    <div className="welcome-customer">
                        {Identify.__("Welcome %s").replace('%s', name)}
                    </div>
                </div>
                <div className="list-menu-item">
                    <MenuList className='list-menu-item-content'>
                        {menu}
                    </MenuList>
                </div>
            </div>
        )
    }

    const renderContent = () => {

        const data = {
            firstname,
            lastname,
            email
        }

        let content = null;
        switch (page) {
            case 'address-book':
                content = <AddressBook history={history} />
                break;
            case 'new-address-book':
                content = <NewAddressBook history={history} isPhone={isPhone} addressId={match.params.addressId} />
                break;
            case 'edit':
                content = <Profile history={history} />
                break;
            case 'my-order':
                content = <MyOrder customer={data} isPhone={isPhone} history={history} />
                break;
            case 'newsletter':
                content = <Newsletter />
                break;
            case 'order-detail':
                content = <OrderDetail history={history} isPhone={isPhone} orderId={match.params.orderId} />
                break;
            case 'wishlist':
                content = <Wishlist history={history} />
                break;
            case 'compare-products':
                content = <CompareProduct history={history} isSignedIn={isSignedIn} />
                break;
            default:
                content = <Dashboard customer={data} history={history} isPhone={isPhone} />
                break
        }
        return content;
    }

    const breadcrumbItems = [{ name: 'Home', link: '/' }, { name: 'Account' }];

    return (<div className={`customer-dashboard ${page}`} style={{ minHeight: window.innerHeight - 200 }}>
        {isPhone && <BreadCrumb history={history} breadcrumb={breadcrumbItems} />}
        <div className='container'>
            <div className="dashboard-layout">
                {!isPhone && renderMenu()}
                <div className='dashboard-content'>
                    {renderContent()}
                </div>
            </div>
        </div>
    </div>)
}

export default CustomerLayout;
