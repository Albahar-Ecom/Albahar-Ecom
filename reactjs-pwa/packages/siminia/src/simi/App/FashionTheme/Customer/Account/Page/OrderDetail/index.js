/* eslint-disable prefer-const */
import React from "react";
import Identify from "src/simi/Helper/Identify";
import { formatPrice } from "src/simi/Helper/Pricing";
import ReactHTMLParse from "react-html-parser";
import { Link } from "src/drivers";
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import DateFormat from 'src/simi/App/FashionTheme/BaseComponents/Date';
import { useWindowSize } from '@magento/peregrine';
import { useMyOrderDetails } from 'src/simi/talons/MyAccount/useMyOrderDetails';
import {
    GET_ORDER_DETAIL,
    RE_ORDER_ITEMS
} from '../../Components/Orders/OrderPage.gql';
import { productUrlSuffix } from 'src/simi/Helper/Url';

require("./style.scss");

const OrderDetail = (props) => {
    const { history, toggleMessages, orderId } = props;


    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const isSmallPhone = windowSize.innerWidth < 601;

    if (!orderId) {
        toggleMessages([{ type: 'error', message: Identify.__('Order number is required.'), auto_dismiss: true }]);
        history.push('/orderhistory.html');
        return null;
    }

    const {
        data,
        reorder
    } = useMyOrderDetails({
        toggleMessages,
        orderNumber: orderId,
        query: { getOrderDetail: GET_ORDER_DETAIL },
        mutation: { reOrderItems: RE_ORDER_ITEMS }
    });

    if (!data) {
        return null;
        // return <Loading />;
    }

    const getFormatPrice = (value, currency) => {
        return formatPrice(Number(value), currency)
    }

    const renderItem = items => {
        let html = null;
        if (items.length > 0) {
            const currency = data.prices.sub_total.currency;
            html = items.map((item, index) => {
                let location = item.sku && `/product.html?sku=${item.sku}` || '';
                if (item.url_key) location = `/${item.url_key}${productUrlSuffix()}`;
                return (
                    <React.Fragment key={Identify.randomString(5)}>
                        <tr key={Identify.randomString(5)} className={(index + 1) == items.length ? 'last-tr' : ''}>
                            <td data-title=""><img src={item.image} alt={item.name} /></td>
                            <td data-title={Identify.__("Product Name")} className="colName">
                                <Link to={location} className="img-name-col">
                                    {ReactHTMLParse(item.name)}
                                </Link>
                            </td>
                            <td data-title={Identify.__("SKU")}>{item.sku}</td>
                            <td data-title={Identify.__("Price")} style={{}}>
                                <span className="price">{getFormatPrice(item.price, currency)}</span>
                            </td>
                            <td data-title={Identify.__("Qty")} style={{ minWidth: '10%' }}>
                                <span className="qty" >
                                    {parseInt(item.qty, 10)}
                                </span>
                            </td>
                            <td data-title={Identify.__("Discount")} style={{ minWidth: '10%' }}>
                                <span className="discount">
                                    {getFormatPrice(item.discount, currency)}
                                </span>
                            </td>
                            <td data-title={Identify.__("Row Total")} style={{}}>
                                {getFormatPrice(item.row_total, currency)}
                            </td>
                        </tr>
                    </React.Fragment>
                );
            });
        }
        return html;
    };

    const renderTableItems = () => {
        let html = null;
        if (data) {
            const totalPrice = data.prices;
            html = (
                <div className="order-detail-table">
                    {
                        <table className={isSmallPhone ? "col-xs-12 table-striped table-siminia" : ""}>
                            <thead>
                                <tr>
                                    <th className="colImage"></th>
                                    <th className="colName">{Identify.__('Product Name')}</th>
                                    <th style={{ textAlign: 'center' }}>{Identify.__('SKU')}</th>
                                    <th style={{ textAlign: 'right' }}>{Identify.__('Price')}</th>
                                    <th style={{ textAlign: 'center' }}>{Identify.__('Qty')}</th>
                                    <th style={{ textAlign: 'center' }}>{Identify.__('Discount')}</th>
                                    <th style={{ textAlign: 'right' }}>{Identify.__('Row Total')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.length > 0
                                    ? renderItem(data.items)
                                    : Identify.__('No product found!')
                                }
                                <tr className="special-row-1" style={{ borderBottom: "unset" }}>
                                    <td colSpan="7">
                                        {Identify.__('Subtotal')}{' '}
                                        {getFormatPrice(totalPrice.sub_total.value, totalPrice.sub_total.currency)}
                                    </td>
                                </tr>
                                <tr className="special-row-1">
                                    <td colSpan="7">
                                        {Identify.__('Tax')}{' '}
                                        {getFormatPrice(totalPrice.tax.value, totalPrice.tax.currency)}
                                    </td>
                                </tr>
                                {totalPrice.discount && parseFloat(totalPrice.discount.value) > 0 &&
                                    <tr className="special-row-1">
                                        <td colSpan="7">
                                            {Identify.__('Discount')}{' '}
                                            {getFormatPrice(totalPrice.discount.value, totalPrice.discount.currency)}
                                        </td>
                                    </tr>
                                }
                                <tr className="special-row-2">
                                    <td colSpan="7">
                                        {Identify.__('Grand Total')}{' '}
                                        {getFormatPrice(totalPrice.grand_total.value, totalPrice.grand_total.currency)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            );
        }
        return html;
    };

    const renderAddress = (address) => {
        let html = null;
        if (address && address instanceof Object && Object.keys(address).length) {
            const name = address.firstname + ' ' + address.lastname;
            let addressLine = address.hasOwnProperty('city') && address.city ? address.city : '';
            if (address.hasOwnProperty('region') && address.region) {
                addressLine = addressLine ? addressLine + ', ' + address.region : addressLine;
            }
            if (address.hasOwnProperty('postcode') && address.postcode) {
                addressLine = addressLine ? addressLine + ', ' + address.postcode : addressLine;
            }

            html = <div className="detail">
                <address>
                    {name && <div>{name}</div>}
                    {address.hasOwnProperty('email') && address.email ? <div>{address.email}</div> : ''}
                    {address.hasOwnProperty('company') && address.company ? <div>{address.company}</div> : ''}
                    {address.hasOwnProperty('street') && address.street ? (address.street instanceof Array ? <div>{address.street.join(', ')}</div> : <div>{address.street}</div>) : ''}
                    {address.hasOwnProperty('street2') && address.street2 ? <div>{address.street2}</div> : ''}
                    {addressLine && <div>{addressLine}</div>}
                    {address.hasOwnProperty('telephone') && address.telephone ? <div>{address.telephone}</div> : ''}
                </address>
            </div>
        }

        return html;
    }

    const renderShippingMethod = () => {
        if (data && (!data.is_virtual)) {
            return (
                <React.Fragment>
                    <div className="col-md-3 detail-col">
                        <div className="title">
                            {Identify.__('Shipping Address')}
                        </div>
                        {data.shipping_address && renderAddress(data.shipping_address)}
                    </div>
                    <div className="col-md-3 detail-col">
                        <div className="title">
                            {Identify.__('Shipping Method')}
                        </div>
                        <div className="detail">
                            {Identify.__(data.shipping_method)}
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    return (
        <div className="dashboard-acc-order-detail">
            <div className="order-detail-page-title">
                {Identify.__("Order") + " #" + data.order_number}{' '}
                <span className="reorder-btn" style={{
                    width: '100px', height: '45px', cursor: 'pointer',
                    fontSize: "14px",
                    background: "#e4e4e4",
                    padding: "5px 10px",
                    borderRadius: "15px"
                }}
                    onClick={() => reorder(data.order_number)}>
                    {Identify.__("Re-order")}
                </span>
            </div>
            <div className="order-date">
                {!isPhone &&
                    <DateFormat data={data.created_at} />
                }
            </div>
            {renderTableItems()}
            <div className="order-information-title">
                {Identify.__('Order Information')}
            </div>
            <div className="order-information-detail">
                <div className="container order-detail-container">
                    <div className="row detail-row">
                        {renderShippingMethod()}
                        <div className="col-md-3 detail-col">
                            <div className="title">
                                {Identify.__('Billing Address')}
                            </div>
                            {data.billing_address && renderAddress(data.billing_address)}

                        </div>
                        <div className="col-md-3 detail-col">
                            <div className="title">
                                {Identify.__('Payment Method')}
                            </div>
                            <div className="detail">
                                {Identify.__(data.payment_method)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(
    null,
    mapDispatchToProps
)(OrderDetail);
