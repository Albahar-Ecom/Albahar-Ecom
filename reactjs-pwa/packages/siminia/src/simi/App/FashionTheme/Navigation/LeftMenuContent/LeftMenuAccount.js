import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import MenuItem from './MenuItem';
import ListItemNested from "src/simi/BaseComponents/MuiListItem/Nested";

const listAccountMenu = [
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
        title: Identify.__('Wishlist'),
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
        sort_order: 60
    },
    {
        title: Identify.__('Logout'),
        url: '/logout.html',
        page: 'logout',
        enable: true,
        sort_order: 110
    }
];

const LeftMenuAccount = props => {

    const { handleMenuItem } = props;

    const openLocation = (location) => {
        if (handleMenuItem) {
            handleMenuItem(location);
        }
    }

    const listPages = pages => {
        let result = null;
        if (pages.length > 0) {
            result = pages.map((page, index) => {
                return (
                    <li key={index} role="presentation"
                        onClick={() => openLocation(page)}
                        className="list-item-account-title">
                        <MenuItem title={Identify.__(page.title)} />
                    </li>
                );
            });
            return <ul>{result}</ul>;
        }
        return null;
    }

    const renderSubItem = (listAccountMenu) => {
        return listAccountMenu.map((item, index) => {
            const accountItem = (
                <div className={'list-account-menu-item'} style={{ display: 'flex' }}>
                    <div className={`account-item-name`}>
                        {item.title}
                    </div>
                </div>
            )
            return (
                <div role="presentation" key={index} style={{ marginLeft: 5, marginRight: 5 }}
                    onClick={() => openLocation(item)}>
                    <MenuItem title={accountItem} className="left-account-item" />
                </div>
            );
        }, this);
    };

    return <div className="left-account-menu">
        <ListItemNested primarytext={<div className="left-menu-account-title" >{Identify.__('ACCOUNT')}</div>}>
            {renderSubItem(listAccountMenu)}
        </ListItemNested>
    </div>
}


export default LeftMenuAccount
