import React from 'react';
require('./icons.scss');

const Icons = props => {
    const data = [
        {
            icon: 'icon-credit-card',
            title: 'Weekend Discount',
            desc: 'Lorem Ipsum is simply dummy text'
        },
        {
            icon: 'icon-truck',
            title: "Free Shipping & Delivery",
            desc: 'Lorem Ipsum is simply'
        },
        {
            icon: 'icon-headphones',
            title: "Friendly Support",
            desc: 'Lorem Ipsum is simply dummy text'
        }
    ]

    const renderHomeIcon = () => {
        return data.map((icon, index) => {
            return (
                <div className="item-wrapper" key={index}>
                    <div className="block-icon">
                        <i className={'icon ' + icon.icon}></i>
                    </div>
                    <div className="title">{icon.title}</div>
                    <div className="desc">{icon.desc}</div>
                </div>
            )
        })
    }

    return (
        <div className="icons-block">
            <div className="home-icon">
                {renderHomeIcon()}
            </div>
        </div>
    )

}

export default Icons
