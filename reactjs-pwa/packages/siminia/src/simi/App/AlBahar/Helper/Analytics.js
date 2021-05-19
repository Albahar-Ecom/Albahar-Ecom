import TagManager from 'react-gtm-module'
import Identify from 'src/simi/Helper/Identify'

export const analyticClickGTM = (product) => {
    try {
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'products': [{
                            'name': product.name,                     
                            'id': product.id,
                            'price': product.price.minimalPrice.amount.value,
                        }]
                    }
                },
            }
        });
    } catch (err) {}
}

export const analyticAddCartGTM = (product, quantity = 1) => {
    try {
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'addToCart',
                'ecommerce': {
                    'add': {                                
                        'products': [{                        
                            'name': product.name,
                            'id': product.id,
                            'price': product.price.minimalPrice.amount.value,
                            'quantity': quantity
                        }]
                    }
                }
            }
        });
    } catch (err) {}
}

export const analyticRemoveCartGTM = (cartItem) => {
    try {
        // if (window.dataLayer){
            // Measure the removal of a product from a shopping cart.
            TagManager.dataLayer({
                dataLayer: { ecommerce: null }
            })
            TagManager.dataLayer({
                dataLayer: {
                    'event': 'removeFromCart',
                    'ecommerce': {
                        'remove': {                                 // 'remove' actionFieldObject measures.
                            'products': [{                          //  removing a product to a shopping cart.
                                'name': cartItem.product.id,
                                'id': cartItem.product.name,
                                'price': cartItem.prices.price.value,
                                'quantity': cartItem.quantity
                            }]
                        }
                    }
                }
            });
        // }
    } catch (err) {}
}

export const analyticPurchaseGTM = (orderNumber, storeName='SimiCart Store', prices, shipping_price, orderItems) => {
    try {
        const shippingMethodPrice = shipping_price && shipping_price instanceof Array && shipping_price.length ? shipping_price[0].selected_shipping_method.amount : 0;
        const products = []
        orderItems.forEach(orderItem => {
            product.push({
                name: orderItem.product.name,
                id: orderItem.product.id,
                quantity: orderItem.quantity,
                price: orderItem.prices.price.value
            })
        });
        if (window.dataLayer) {
            TagManager.dataLayer({
                dataLayer: {
                    'event': 'purchase',
                    'ecommerce': {
                        'purchase': {
                            'actionField': {
                                'id': orderNumber,
                                'affiliation': storeName,
                                'revenue': prices.grand_total,
                                'tax': prices.applied_taxes,
                                'shipping': shippingMethodPrice,
                            },
                            'products': products
                        }
                    }
                }
                
            });
        }
    } catch (err) { }
}


export const analyticImpressionsGTM = (products, category = '', list_name = '') => {
    try {
        const storeConfig = Identify.getStoreConfig();
        const simiRootCate = storeConfig && storeConfig.simiRootCate || {};
        const config = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config || {};
        const currency = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.currency || 'USD';
        let brands = new Map();
        if (config.brands) {
            config.brands.map((item) => {
                brands.set(item.option_id, item.name);
                return item;
            });
        }
        let categories = new Map();
        if (simiRootCate.children) {
            simiRootCate.children.map((item) => {
                categories.set(item.id, item);
                return item;
            });
            categories.set(simiRootCate.id, simiRootCate);
        }
        let impressions = [];
        for(let i=0, len = products.length; i<len; i++){
            let extraAttributes = products[i].simiExtraField && products[i].simiExtraField.attribute_values || {};
            let price = products[i].price && (products[i].price.minimalPrice || products[i].price.regularPrice) || {};
            let catIds = extraAttributes.category_ids || [];
            let _p_cat = products[i].categories && products[i].categories.pop() || categories.get(parseInt(catIds.pop()));
            let brandId = extraAttributes.brand || '';
            let brand = brands.get(brandId);
            let impressObj = {
                'name': products[i].name,       // Name or ID is required.
                'id': products[i].id,
                'brand': brand || '',
                'category': category || _p_cat && _p_cat.name || 'Default Category',
                'list': list_name,
                'position': (i + 1)
            }
            if (price.amount) impressObj.price = price.amount && price.amount.value;
            impressions.push(impressObj);
        }
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'productImpression',
                'ecommerce': {
                    'currencyCode': currency,
                    'impressions': impressions
                }
            }
        });

    } catch (err) {}
}
