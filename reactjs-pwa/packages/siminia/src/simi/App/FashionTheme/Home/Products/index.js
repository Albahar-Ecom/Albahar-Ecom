import React from 'react';
import Identify from "src/simi/Helper/Identify";
import Product from './Product';
import Skeleton from 'react-loading-skeleton';

require('./products.scss');

const Products = props => {
    const { data, history, isPhone } = props;
    const desc = Identify.__("Lorem Ipsum has been the industry's standard dummy text ever since the 1500s")

    const renderHomeProduct = () => {
        if (data && data.homeproductlists) {
            let cloneDataForEditing = JSON.parse(JSON.stringify(data));
            const sortData = cloneDataForEditing.homeproductlists.sort((a, b) => a.sort_order - b.sort_order)
            return sortData.map((homeproduct, index) => {
                return <Product
                    title={homeproduct.list_title}
                    cateId={homeproduct.category_id}
                    history={history}
                    isPhone={isPhone}
                    key={index}
                    desc={desc} />
            })

        }

        return <Skeleton />
    }

    return (
        <div className="home-products">
            {renderHomeProduct()}
        </div>
    )

}

export default Products
