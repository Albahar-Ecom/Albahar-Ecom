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

export const analyticCheckoutOptionGTM = (step, checkoutOption) => {
    try {
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'checkoutOption',
                'ecommerce': {
                    'checkout_option': {
                        'actionField': {'step': step, 'option': checkoutOption}
                    }
                }
            }
        });
    } catch (err) {}
}

export const analyticCheckoutGTM = (cartItems) => {
    // try {
        const products = []
        cartItems.forEach((cartItem) => {
            const {configurable_options, product, quantity} = cartItem
            let variant = ''
            if(configurable_options) {
                configurable_options.forEach((option) => {
                    if(variant.length > 0) {
                        variant += ` ,${option.value_label} `
                    } else {
                        variant += option.value_label
                    }
                })
            }
            const productObj = {
                name: product.name,
                id: product.id,
                quantity: parseInt(quantity)
            }
            if(variant) {
                productObj.variant = variant
            }
            products.push(productObj)
        })
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'checkout',
                'ecommerce': {
                    'checkout': {
                      'actionField': {'step': 1, 'option': 'initCheckout'},
                      'products': products
                   }
                },
            }
        });
    // } catch (err) {}
}

export const analyticAddCartGTM = (product, quantity = 1, optionsSelected = null) => {
    try {
        const storeConfig = Identify.getStoreConfig();
        const currency = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.currency || 'USD';
        const {configurable_options} = product
        let variant = '';
        if(configurable_options && optionsSelected) {
            optionsSelected.forEach((value, key) => {
                configurable_options.forEach(optionItems => {
                    if(parseInt(optionItems.attribute_id) === parseInt(key)) {
                        optionItems.values.forEach((optionItem) => {
                            if(parseInt(optionItem.value_index) === parseInt(value)) {
                                if(variant.length > 0) {
                                    variant += ` ,${optionItem.label}`
                                } else {
                                    variant += `${optionItem.label}`
                                }
                            }
                        })
                    }
                })
            })
        }

        const products = [{                        
            'name': product.name,
            'id': product.id,
            'price': product.price.minimalPrice.amount.value,
            'quantity': parseInt(quantity),
        }]

        if(variant) {
            products[0].variant = variant
        }

        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': currency,
                    'add': {                                
                        'products': products
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
         
            const {configurable_options, product, prices, quantity} = cartItem
            let variant = ''
            if(configurable_options) {
                configurable_options.forEach((option) => {
                    if(variant.length > 0) {
                        variant += ` ,${option.value_label} `
                    } else {
                        variant += `${option.value_label} `
                    }
                })
            }
            const products = [{                          //  removing a product to a shopping cart.
                'name': product.name,
                'id': product.id,
                'price': prices.price.value,
                'quantity': parseInt(quantity)
            }];
            if(variant) {
                products[0].variant = variant
            }
            TagManager.dataLayer({
                dataLayer: { ecommerce: null }
            })
            TagManager.dataLayer({
                dataLayer: {
                    'event': 'removeFromCart',
                    'ecommerce': {
                        'remove': {                                 // 'remove' actionFieldObject measures.
                            'products': products
                        }
                    }
                }
            });
        // }
    } catch (err) {}
}

export const analyticPurchaseGTM = (orderNumber, storeName='SimiCart Store', prices, shipping_price, orderItems) => {
    try {
        const taxPrice = prices.applied_taxes && prices.applied_taxes instanceof Array && prices.applied_taxes.amount && prices.applied_taxes.amount.value ? prices.applied_taxes.amount.value : 0;
        const shippingMethodPrice = shipping_price && shipping_price instanceof Array && shipping_price.length > 0 && shipping_price[0].selected_shipping_method  && shipping_price[0].selected_shipping_method.amount ? shipping_price[0].selected_shipping_method.amount : 0;
        const products = []
        orderItems.forEach(orderItem => {
            const {configurable_options, product, quantity, prices} = orderItem
            let variant = ''
            if(configurable_options) {
                configurable_options.forEach((option) => {
                    if(variant.length > 0) {
                        variant += ` ,${option.value_label}`
                    } else {
                        variant += `${option.value_label}`
                    }
                })
            }
            const productObj = {
                name: product.name,
                id: product.id,
                quantity: parseInt(quantity),
                price: prices.price.value
            }
            if(variant) {
                productObj.variant = variant
            }   
            products.push(productObj)         
        });
        if (window.dataLayer) {
            TagManager.dataLayer({
                dataLayer: { ecommerce: null }
            })
            TagManager.dataLayer({
                dataLayer: {
                    'event': 'purchase',
                    'ecommerce': {
                        'purchase': {
                            'actionField': {
                                'id': orderNumber,
                                'affiliation': storeName,
                                'revenue': prices.grand_total.value,
                                'tax': taxPrice,
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

export const analyticsViewDetailsGTM = (product) => {
    try {
        TagManager.dataLayer({
            dataLayer: { ecommerce: null }
        })
        TagManager.dataLayer({
            dataLayer: {
                'event': 'productView',
                'ecommerce': {
                    'detail': {
                        'products': [{
                        'name': product.name, 
                        'id': product.id || 0,
                        'price': product.price.minimalPrice.amount.value || 0
                        }]
                    },
                }
            }
        })
    } catch(err) {

    }
}