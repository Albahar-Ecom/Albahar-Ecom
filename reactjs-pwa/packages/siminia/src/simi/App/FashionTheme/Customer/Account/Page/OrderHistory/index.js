import React from 'react';
import OrderHistory from '../../Components/Orders/OrderList';
import Identify from "src/simi/Helper/Identify";
import TitleHelper from 'src/simi/Helper/TitleHelper';
require('./style.scss')

const MyOrder = props => {
    const {customer} = props
    return (
        <div className='account-my-orders-history'>
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Orders'),
                desc: Identify.__('My Orders') 
            })}
            <div className="order-history">
                <div className="customer-page-title">
                    {Identify.__("My Orders")}
                </div>
                <div className='account-my-orders'>
                    <OrderHistory showForDashboard={false} customer={customer} />
                </div>
            </div>
        </div>
    )
}

export default MyOrder;