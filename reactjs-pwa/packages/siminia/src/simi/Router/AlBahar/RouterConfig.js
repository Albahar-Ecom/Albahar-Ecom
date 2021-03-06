import React from 'react'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent'
import Home from 'src/simi/App/AlBahar/RootComponents/CMS/Home'

// const Home = (props) => {
//     return <LazyComponent component={() => import(/* webpackChunkName: "Home"*/'src/simi/App/core/RootComponents/CMS/Home')} {...props}/>
// }

const Account = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "CAccount"*/'src/simi/App/AlBahar/Customer/Account')} {...props} />
}

const Checkout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Checkout"*/'src/simi/App/AlBahar/Checkout')} {...props} />
}

const CheckoutFailure = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "CheckoutFailure"*/'src/simi/App/AlBahar/Checkout/checkoutPageFailure')} {...props} />
}

const Login = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Login"*/'src/simi/App/AlBahar/Customer/Login')} {...props} />
}

const Cart = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Cart"*/'src/simi/App/AlBahar/Cart')} {...props} />
}

const Contact = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Contact"*/'src/simi/App/AlBahar/Contact')} {...props} />
}

const Product = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "SimiProduct"*/'src/simi/App/AlBahar/RootComponents/Product')} {...props} />
}

const BrandDetails = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "BrandDetails"*/'src/simi/App/AlBahar/Shopbybrand/Category')} {...props} />
}

const Search = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Search"*/'src/simi/App/AlBahar/RootComponents/Search')} {...props} />
}

const Logout = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "Logout"*/'src/simi/App/core/Customer/Logout')} {...props} />
}

const ResetPassword = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "ResetPassword"*/'src/simi/App/AlBahar/Customer/ResetPassword')} {...props} />
}

const PaypalExpress = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PaypalExpress"*/'src/simi/App/core/Payment/Paypalexpress')} {...props} />
}

const PPfailure = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "PPfailure"*/'src/simi/App/core/Payment/Paypalexpress/PPfailure')} {...props} />
}

const BrandCategory = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "BrandCategory"*/'src/simi/App/AlBahar/Shopbybrand/components/category/index')} {...props} />
}

// const BrandDetails = (props) => {
//     return <LazyComponent component={() => import(/* webpackChunkName: "BrandDetails"*/'src/simi/App/AlBahar/Shopbybrand/components/branddetails/index')} {...props} />
// }

const BrandList = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "BrandList"*/'src/simi/App/AlBahar/Shopbybrand/components/brands/index')} {...props} />
}

const NoMatch = (props) => {
    return <LazyComponent component={() => import(/* webpackChunkName: "NoMatch"*/'src/simi/App/AlBahar/NoMatch')} {...props}/>
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
    checkout_failure: {
        path: '/checkout-failure.html',
        render: (location) => <CheckoutFailure {...location} />
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
        path: '/addresses.html/:id?',
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
    contact: {
        path: '/contact.html',
        render: location => <Contact {...location} page={`contact`} />
    },
    ppExpress: {
        path: '/paypal_express.html',
        render: location => <PaypalExpress {...location} />
    },
    ppExpressFailure: {
        path: '/paypal_express_failure.html',
        render: location => <PPfailure {...location} />
    },
    brandCategory: {
        path: '/brand/category/:categoryUrl?',
        render: location => <BrandCategory {...location} />
    },
    brandDetails: {
        path: '/brand/:brandUrl?',
        render: location => <BrandDetails {...location} />
    },
    brandList: {
        path: '/brand.html',
        render: location => <BrandList {...location} />
    },
    noMatch: {
        component: location => <NoMatch {...location} />
    }
}
export default router;
