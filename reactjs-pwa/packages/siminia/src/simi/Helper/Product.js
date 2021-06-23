import {taxConfig} from './Pricing'

//prepare product price and options
export const prepareProduct = (product) => {
    let modedProduct = JSON.parse(JSON.stringify(product))
    modedProduct = addCatalogPriceRule(modedProduct)
    const price = modedProduct.price

    //add tax to price
    const merchantTaxConfig = taxConfig()
    const adjustments = (product.type_id === 'grouped')?price.minimalPrice.adjustments:price.regularPrice.adjustments
    price.show_ex_in_price = (adjustments && adjustments.length)?parseInt(merchantTaxConfig.tax_display_type, 10) === 3 ? 1 : 0 : 0
    price.minimalPrice.excl_tax_amount = addExcludedTaxAmount(price.minimalPrice.amount, price.minimalPrice.adjustments)
    price.regularPrice.excl_tax_amount = addExcludedTaxAmount(price.regularPrice.amount, price.regularPrice.adjustments)
    price.maximalPrice.excl_tax_amount = addExcludedTaxAmount(price.maximalPrice.amount, price.maximalPrice.adjustments)

    //check discount (for simple, downloadable, virtual products)
    price.has_special_price = false
    if (product.type_id !== 'grouped' && product.type_id !== 'configurable' && product.type_id !== 'bundle') {
        price.has_special_price = (price.regularPrice.amount.value > price.minimalPrice.amount.value) ? true : false
        if (price.has_special_price) {
            const sale_off = 100 - (price.minimalPrice.amount.value / price.regularPrice.amount.value) * 100;
            price.discount_percent = sale_off.toFixed(0);
        }
    }

    modedProduct.price = price
    return modedProduct
}

const addExcludedTaxAmount = (amount, adjustments) => {
    let excludedTaxPrice = amount.value
    if (adjustments && adjustments.length) {
        adjustments.forEach(adjustment => {
            if (adjustment.description === 'INCLUDED' && adjustment.code === 'TAX') {
                excludedTaxPrice = excludedTaxPrice - adjustment.amount.value
            }
        })
    }
    return {
        value :excludedTaxPrice,
        currency: amount.currency
    }
}

const addCatalogPriceRule = (product) => {
    if(
        product.hasOwnProperty('simiDiscount') 
        && product.simiDiscount && product.simiDiscount.length > 0
    ) {
        const price = product.price
        if(price.minimalPrice.amount.value === price.regularPrice.amount.value) {
            if(product.type_id !== 'bundle') {
                const productDiscount = product.simiDiscount.find((discount) => discount.product_id === product.id) 
                if (productDiscount) {
                    price.minimalPrice.amount.value = productDiscount.amount
                    price.maximalPrice.amount.value = productDiscount.amount

                    product.price = price
                } else {
                    const minDiscount = product.simiDiscount.reduce((p, v) => {
                        return ( p.amount < v.amount ? p.amount : v.amount )
                    })  
            
                    price.minimalPrice.amount.value = minDiscount
                    price.maximalPrice.amount.value = minDiscount
                    product.price = price
                }
            } else {
                const productDiscount = product.simiDiscount.find((discount) => discount.product_id === product.id) 
                if(productDiscount) {
                    const bundleItems = product.items || []
                
                    let maxPrice = productDiscount.amount
                    bundleItems.forEach((item) => {
                        if(item.options && item.options.length > 0) {
                            item.options.forEach((option) => {
                                if(option.product && option.product.stock_status === 'IN_STOCK') {
                                    maxPrice = maxPrice + option.price
                                }
                            })
                        }
                    })

                    if(price.maximalPrice.amount.value > maxPrice) {
                        const diffPrice = price.maximalPrice.amount.value - maxPrice
                        const minPrice = price.minimalPrice.amount.value - diffPrice

                        price.minimalPrice.amount.value = minPrice
                        price.maximalPrice.amount.value = maxPrice

                        product.price = price
                    }
                } else {
                    let maxPrice = 0
                    let minPrice = 0
                    const bundleItems = product.items || []
                    bundleItems.forEach((item) => {
                        if(item.options && item.options.length > 0) {
                            let maxOptionPrice = 0
                            let minOptionPrice = 0
                            item.options.forEach((option) => {   
                                if(option.product && option.product.stock_status === 'IN_STOCK') {
                                    const optionDiscount = product.simiDiscount.find(discount => discount.product_id === option.product.id) 
                                    if(optionDiscount) {
                                        try {
                                            if(maxOptionPrice < optionDiscount.amount) {
                                                maxOptionPrice = optionDiscount.amount
                                            }

                                            if(item.required) {
                                                if(minOptionPrice == 0) {
                                                    minOptionPrice = optionDiscount.amount
                                                } else {
                                                    if(optionDiscount.amount < minOptionPrice) {
                                                        minOptionPrice = optionDiscount.amount
                                                    }
                                                }
                                            }
                                            option.product.price_range.maximum_price.final_price.value = optionDiscount.amount
                                            option.product.price_range.minimum_price.final_price.value = optionDiscount.amount
                                        } catch (e) {
                                            console.warn(e)
                                        }
                                    }
                                }
                            })

                            if(maxOptionPrice > 0) {
                                maxPrice = maxPrice + maxOptionPrice
                            }

                            if(minOptionPrice > 0) {
                                minPrice = minPrice + minOptionPrice
                            }
                        }
                    })
                    
                    if(price.maximalPrice.amount.value > maxPrice) {
                        price.maximalPrice.amount.value = maxPrice
                    } 
                    if(price.minimalPrice.amount.value > minPrice ) {
                        price.minimalPrice.amount.value = minPrice
                    }
                    product.price = price
                    product.items = bundleItems
                }
            }
       
        }

        //add variants
        if(product.hasOwnProperty('variants') && product.variants) {
            const variants = product.variants
            variants.forEach(variant => {
                try {
                    const variantPrice = variant.product.price
                    if(variantPrice.minimalPrice && variantPrice.regularPrice && variantPrice.minimalPrice.amount.value === variantPrice.regularPrice.amount.value) {
                        const variantDiscount = product.simiDiscount.find((discount) => discount.product_id === variant.product.id)
        
                        variantPrice.minimalPrice.amount.value = variantDiscount.amount
                        variantPrice.maximalPrice.amount.value = variantDiscount.amount
        
                        variant.product.price = variantPrice
                    }
                } catch (e) {

                }
            })
        }

        if(product.type_id === 'grouped') {
            const groupedItems = product.items
            groupedItems.forEach(groupedItem => {
                const groupedDiscount = product.simiDiscount.find(discount => groupedItem.product.id === discount.product_id)
                if(groupedDiscount) {
                    if(groupedDiscount.amount < groupedItem.product.price_range.maximum_price.final_price.value ) {
                        groupedItem.product.price_range.maximum_price.final_price.value = groupedDiscount.amount
                    }

                    if(groupedDiscount.amount < groupedItem.product.price_range.minimum_price.final_price.value ) {
                        groupedItem.product.price_range.minimum_price.final_price.value = groupedDiscount.amount
                    }
                }
            })

            const minDiscount = product.simiDiscount.reduce((p, v) => {
                return ( p.amount < v.amount ? p.amount : v.amount )
            })  

            product.price.minimalPrice.amount.value = minDiscount
            product.price.maximalPrice.amount.value = minDiscount
        }
        // product.simiDiscount.forEach((discount) => {
        //     product = variants.find((variant) => variant.product.id === discount.product_id)
        // })
    }
    return product
}

//add simiProductListItemExtraField to items
export const applySimiProductListItemExtraField = (simiproducts) => {
    let modedSimiproducts = JSON.parse(JSON.stringify(simiproducts))
    modedSimiproducts.items = simiproducts.items.map((product) => {
        let modedProduct = JSON.parse(JSON.stringify(product))
        try {
            if (product && product.simiExtraField && typeof product.simiExtraField  === 'string') {
                modedProduct.simiExtraField = JSON.parse(product.simiExtraField)
            }
        } catch (err) {
            console.log(product)
            console.warn(err)
        }
        return modedProduct
    })
    return modedSimiproducts
}