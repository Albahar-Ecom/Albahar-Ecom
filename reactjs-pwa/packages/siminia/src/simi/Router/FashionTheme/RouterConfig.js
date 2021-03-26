import React from 'react'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent'
import Home from 'src/simi/App/FashionTheme/RootComponents/CMS/Home'

const Account = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "CAccount"*/'src/simi/App/FashionTheme/Customer/Account')} {...props} />
}

// const Home = (props) => {
//     return <LazyComponent component={() => import(/* webpackChunkName: "Home"*/'src/simi/App/FashionTheme/RootComponents/CMS/Home')} {...props}/>
// }

const Checkout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Checkout"*/'src/simi/App/core/Checkout')} {...props}/>
}

const PaypalExpress = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PaypalExpress"*/'src/simi/App/core/Payment/Paypalexpress')} {...props} />
}

const Login = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Login"*/'src/simi/App/FashionTheme/Customer/Login')} {...props} />
}

const Cart = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Cart"*/'src/simi/App/core/Cart')} {...props}/>
}

const Contact = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Contact"*/'src/simi/App/core/Contact/Contact')} {...props} />
}

const Product = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "SimiProduct"*/'src/simi/App/FashionTheme/RootComponents/Product')} {...props} />
}

const Search = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Search"*/'src/simi/App/FashionTheme/RootComponents/Search')} {...props} />
}

const Logout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Logout"*/'src/simi/App/core/Customer/Logout')} {...props} />
}

const ResetPassword = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "ResetPassword"*/'src/simi/App/FashionTheme/Customer/ResetPassword')} {...props} />
}

const NoMatch = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "NoMatch"*/'src/simi/App/FashionTheme/NoMatch')} {...props} />
}

const PPfailure = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PaypalExpress"*/'src/simi/App/core/Payment/Paypalexpress/PPfailure')} {...props} />
}


const router = {
    home: {
        path: '/',
        render: (location) => <Home {...location} />
    },
    search_page: {
        path: '/search.html',
        render: (props) => <Search {...props} />
    },
    cart: {
        path: '/cart.html',
        component: (location) => <Cart {...location} />
    },
    product_detail: {
        path: '/product.html',
        render: (location) => <Product {...location} />
    },
    category_page: {
        path: '/category.html',
        render: (location) => <Product {...location} />
    },
    checkout: {
        path: '/checkout.html',
        render: (location) => <Checkout {...location} />
    },
    ppExpress: {
        path: '/paypal_express.html',
        render: location => <PaypalExpress {...location} />
    },
    ppExpressFailure: {
        path: '/paypal_express_failure.html',
        render: location => <PPfailure {...location} />
    },
    login: {
        path: '/login.html',
        render: (location) => <Login {...location} />
    },
    logout: {
        path: '/logout.html',
        render: (location) => <Logout {...location} />
    },
    customer_reset_password: {
        path: '/customer/account/createPassword',
        render: (location) => <ResetPassword {...location} />
    },
    account: {
        path: '/account.html',
        render: (location) => <Account {...location} page='dashboard' />
    },
    address_book: {
        path: '/addresses.html',
        render: location => <Account {...location} page={`address-book`} />
    },
    new_address_book: {
        path: '/new-address.html/:addressId?',
        render: location => <Account {...location} page={`new-address-book`} />
    },
    oder_history: {
        path: '/orderhistory.html',
        render: location => <Account {...location} page={`my-order`} />
    },
    order_history_detail: {
        path: '/orderdetails.html/:orderId',
        render: location => <Account {...location} page={`order-detail`} />
    },
    newsletter: {
        path: '/newsletter.html',
        render: location => <Account {...location} page={`newsletter`} />
    },
    profile: {
        path: '/profile.html',
        render: location => <Account {...location} page={`edit`} />
    },
    wishlist: {
        path: '/wishlist.html',
        render: (location) => <Account {...location} page={`wishlist`} />
    },
    compare_products: {
        path: '/my-compare-products.html',
        render: location => <Account {...location} page={`compare-products`} />
    },
    contact: {
        path: '/contact.html',
        render: location => <Contact {...location} page={`contact`} />
    },
    noMatch: {
        component: location => <NoMatch {...location} />
    }
}
export default router;
