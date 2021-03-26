import React, { Component, Suspense } from 'react';
import { arrayOf, bool, number, shape, string, object } from 'prop-types';
import { smoothScrollToView } from 'src/simi/Helper/Behavior'
import Loading from 'src/simi/BaseComponents/Loading'
import { Colorbtn } from 'src/simi/BaseComponents/Button'
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import ProductImage from './ProductImage';
import Quantity from './ProductQuantity';
import isProductConfigurable from 'src/util/isProductConfigurable';
import Identify from 'src/simi/Helper/Identify';
import * as Constants from 'src/simi/Config/Constants';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { prepareProduct } from 'src/simi/Helper/Product'
import ProductPrice from '../Component/Productprice';
import { configColor } from 'src/simi/Config'
import { showToastMessage } from 'src/simi/Helper/Message';
import ReactHTMLParse from 'react-html-parser';
import BreadCrumb from 'src/simi/App/FashionTheme/BaseComponents/BreadCrumb'
import { TopReview, ReviewList } from './Review/index';
import Description from './Description';
import Techspec from './Techspec';
import LinkedProduct from './LinkedProduct';
import Tabs from "src/simi/App/FashionTheme/BaseComponents/Tabs";
import CompareProduct from 'src/simi/App/FashionTheme/BaseComponents/CompareProducts';
import { productUrlSuffix } from 'src/simi/Helper/Url';
import { showToastSuccess } from 'src/simi/Helper/MessageSuccess';
import Skeleton from 'react-loading-skeleton';
import { SimiMutation } from 'src/simi/Network/Query';
import WishlistHeart from './WishlistHeart';
import TierPrices from './TierPrices';
import {
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION,
    ADD_BUNDLE_MUTATION,
    ADD_DOWNLOADABLE_MUTATION,
    ADD_GROUP_AND_CUSTOM_OPT_MUTATION,
    ADD_VIRTUAL_MUTATION,
    ADD_VIRTUAL_CUSTOM_OPT_MUTATION,
    ADD_DOWNLOADABLE_AND_CUSTOM_OPT_MUTATION
} from 'src/simi/App/core/RootComponents/Product/ProductFullDetail/productFullDetail.gql';

const ConfigurableOptions = React.lazy(() => import('./Options/ConfigurableOptions'));
const CustomOptions = React.lazy(() => import('./Options/CustomOptions'));
const BundleOptions = React.lazy(() => import('./Options/Bundle'));
const GroupedOptions = React.lazy(() => import('./Options/GroupedOptions'));
const DownloadableOptions = React.lazy(() => import('./Options/DownloadableOptions'));

require('./productFullDetail.scss');

class ProductFullDetail extends Component {
    state = {
        optionCodes: new Map(),
        optionSelections: new Map(),
        showModalCompare: false,
        compare: Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product') || null
    };
    quantity = 1

    static getDerivedStateFromProps(props, state) {
        const { configurable_options } = props.product;
        const optionCodes = new Map(state.optionCodes);
        // if this is a simple product, do nothing
        if (!isProductConfigurable(props.product) || !configurable_options) {
            return null;
        }
        // otherwise, cache attribute codes to avoid lookup cost later
        for (const option of configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }
        return { optionCodes };
    }

    setQuantity = quantity => this.quantity = quantity;

    prepareParams = () => {
        const { props, state, quantity } = this;
        const { optionSelections } = state;
        const { product } = props;
        const params = { product: String(product.id), qty: quantity ? String(quantity) : '1' }
        if (this.customOption) {
            const customOptParams = this.customOption.getParams()
            if (customOptParams && customOptParams.options) {
                params['options'] = customOptParams.options
            } else
                this.missingOption = true
        }
        if (this.bundleOption) {
            const bundleOptParams = this.bundleOption.getParams()
            if (bundleOptParams && bundleOptParams.bundle_option_qty && bundleOptParams.bundle_option) {
                params['bundle_option'] = bundleOptParams.bundle_option
                params['bundle_option_qty'] = bundleOptParams.bundle_option_qty
            }
        }
        if (this.groupedOption) {
            const groupedOptionParams = this.groupedOption.getParams()
            if (groupedOptionParams && groupedOptionParams.super_group) {
                params['super_group'] = groupedOptionParams.super_group
            }
        }
        if (this.downloadableOption) {
            const downloadableOption = this.downloadableOption.getParams();
            if (downloadableOption && downloadableOption.links) {
                params['links'] = downloadableOption.links
            } else
                this.missingOption = true
        }

        if (optionSelections && optionSelections.size) { //configurable option
            if (this.isMissingConfigurableOptions) {
                this.missingOption = true
            }
            const super_attribute = {}
            optionSelections.forEach((value, key) => {
                super_attribute[String(key)] = String(value)
            });

            params['super_attribute'] = super_attribute
        }
        return params;
    }

    updateCompareList = () => {
        this.setState({ compare: Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product') })
    }

    addToCompare = () => {
        const { product } = this.props;
        const compareData = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
        let compareProducts;
        if (compareData) {
            compareProducts = compareData;
            const result = compareProducts.find(item => item.id == product.id)
            if (result) {
                this.showModalCompare();
                showToastMessage(Identify.__('Product exist in compare list!'))
            } else {
                this.addOneProductToCompareList(product)
            }
        } else {
            this.addOneProductToCompareList(product)
        }
    }

    showModalCompare = () => {
        this.setState({ showModalCompare: true });
    }

    closeModalCompare = () => {
        this.setState({ showModalCompare: false });
    }

    addOneProductToCompareList = (item) => {
        const storeageData = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
        let compareProducts;

        if (storeageData) {
            compareProducts = storeageData;
            compareProducts.push(item);
            Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', compareProducts);
            this.updateCompareList()
            this.showModalCompare();
            showToastSuccess(Identify.__('Product has added to your compare list !'))
        } else {
            compareProducts = [];
            compareProducts.push(item);
            Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', compareProducts);
            this.updateCompareList()
            this.showModalCompare();
            showToastSuccess(Identify.__('Product has added to your compare list !'))
        }
    }

    handleConfigurableSelectionChange = (optionId, selection) => {
        this.setState(({ optionSelections }) => ({
            optionSelections: new Map(optionSelections).set(
                optionId,
                Array.from(selection).pop()
            )
        }));
    };

    get isMissingConfigurableOptions() {
        const { product } = this.props;
        const { configurable_options } = product;
        const numProductOptions = configurable_options.length;
        const numProductSelections = this.state.optionSelections.size;
        return numProductSelections < numProductOptions;
    }

    get fallback() {
        return <Loading />;
    }

    get productOptions() {
        const { fallback, handleConfigurableSelectionChange, props } = this;
        const { configurable_options, type_id, is_dummy_data,
            downloadable_product_links, downloadable_product_samples,
            links_title, links_purchased_separately, items, id } = props.product;
        const isConfigurable = isProductConfigurable(prepareProduct(props.product));

        if (is_dummy_data)
            return <Skeleton />
        return (
            <Suspense fallback={fallback}>
                {isConfigurable && <ConfigurableOptions
                    options={configurable_options}
                    onSelectionChange={handleConfigurableSelectionChange}
                />}
                {type_id === 'bundle' && <BundleOptions
                    key={Identify.randomString(5)}
                    app_options={items ? items : []}
                    product_id={id}
                    ref={e => this.bundleOption = e}
                    parent={this}
                />}
                {type_id === 'grouped' && <GroupedOptions
                    key={Identify.randomString(5)}
                    app_options={items ? items : []}
                    product_id={id}
                    ref={e => this.groupedOption = e}
                    parent={this}
                />}
                {type_id === 'downloadable' && <DownloadableOptions
                    key={Identify.randomString(5)}
                    app_options={{ downloadable_product_links, downloadable_product_samples, links_title, links_purchased_separately }}
                    product_id={id}
                    ref={e => this.downloadableOption = e}
                    parent={this}
                />}
                {(props.product.hasOwnProperty('options') && props.product.options instanceof Array && props.product.options.length) &&
                    <CustomOptions
                        key={Identify.randomString(5)}
                        app_options={{ custom_options: props.product.options }}
                        product_id={id}
                        ref={e => this.customOption = e}
                        parent={this}
                    />}
            </Suspense>
        );
    }

    breadcrumb = (product) => {
        let breadcrumbs = Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, Constants.BREADCRUMBS);
        if (!breadcrumbs || breadcrumbs.length == 0) {
            breadcrumbs = [{ name: Identify.__("Home"), link: '/' }];
            if (product && product.categories) {
                let cate = product.categories.pop();
                if (cate) {
                    breadcrumbs.push({ name: cate.name, link: cate.url_path + productUrlSuffix() });
                }
            }
        }

        return <BreadCrumb breadcrumb={breadcrumbs} history={this.props.history}>
            {product.name}
        </BreadCrumb>
    }

    handleAddYourReview = () => {
        if (this.tabs) {
            this.tabs.openTab(2);
            smoothScrollToView($('.tab-content'));
        }
    }

    mutationAction = (mutation, sku) => {
        const { cartId, product } = this.props;

        if (product && product.id && cartId && sku) {
            const { type_id, options, items } = product;
            this.missingOption = false
            const params = this.prepareParams();
            if (this.missingOption) {
                showToastMessage(Identify.__('Please select the options required (*)'));
                return;
            }
            if (params && params.qty) {
                let variableParams = {
                    cartId,
                    quantity: Number(params.qty),
                    sku
                };

                switch (type_id) {
                    case 'configurable':
                        if (!params.hasOwnProperty('super_attribute') ||
                            (params.hasOwnProperty('super_attribute') && Object.values(params.super_attribute).includes("undefined"))) {
                            showToastMessage(Identify.__('Please select the options required (*)'));
                            return;
                        }

                        const { super_attribute } = params;

                        let findVariant = null;
                        const { variants } = product;
                        const arrayAttrSelected = Object.values(super_attribute);
                        for (let c in variants) {
                            const variantItem = variants[c];
                            const variantItemAttr = variantItem.attributes;
                            const arrayValues = [];
                            for (let k in variantItemAttr) {
                                const attrItem = variantItemAttr[k];
                                if (attrItem.hasOwnProperty('value_index')) {
                                    arrayValues.push(attrItem.value_index);
                                }
                            }
                            const isFounded = arrayAttrSelected.every(ai => arrayValues.includes(Number(ai)));
                            if (isFounded) {
                                findVariant = variantItem; break;
                            }
                        }
                        // const findVariant = variants.find(({ attributes }) => attributes.find(({ value_index }) => Object.values(super_attribute).includes(String(value_index))));
                        if (!findVariant) {
                            showToastMessage(Identify.__('Could not found item variant!'));
                            return;
                        }

                        variableParams = {
                            cartId,
                            quantity: params.qty,
                            sku: findVariant.product.sku,
                            parentSku: sku
                        };
                        break;
                    case 'bundle':
                        if (!params.hasOwnProperty('bundle_option') || !params.hasOwnProperty('bundle_option_qty')) {
                            showToastMessage(Identify.__('Please select the options required (*)'));
                            return;
                        }

                        const { bundle_option, bundle_option_qty } = params;
                        if (items && items.length && items.length !== Object.keys(bundle_option).length) {
                            showToastMessage(Identify.__('Please select the options required (*)'));
                            return;
                        }
                        let opts = [];
                        for (const i in bundle_option) {
                            const bundleValue = bundle_option[i] instanceof Array ? bundle_option[i] : [String(bundle_option[i])];
                            const objOpt = {
                                id: Number(i),
                                quantity: Number(bundle_option_qty[i]),
                                value: bundleValue
                            };
                            opts.push(objOpt);
                        };
                        variableParams = {
                            cartId,
                            quantity: params.qty,
                            sku: sku,
                            bundleOptions: opts
                        };

                        break;
                    case 'downloadable':
                        let listLinks = [];
                        const { links } = params;
                        if (!links || !links instanceof Array) {
                            showToastMessage(Identify.__('Please select the options required (*)'));
                            return;
                        }

                        for (const i in links) {
                            const linkId = links[i] instanceof Array ? links[i][0] : links[i];
                            listLinks.push({ link_id: linkId });
                        }

                        if (options) {
                            if (!params.hasOwnProperty('options')) {
                                showToastMessage(Identify.__('Please select the options required (*)'));
                                return;
                            }
                            const paramOptions = params.options;
                            let customizedOptions = [];
                            for (const opt in paramOptions) {
                                if (!paramOptions[opt] || (paramOptions[opt] instanceof Array && paramOptions[opt].length < 1)
                                    || (paramOptions[opt] instanceof Object && Object.keys(paramOptions[opt]).length < 1)) continue;

                                let valStr = '';

                                if (paramOptions[opt] instanceof Object) {
                                    if (paramOptions[opt].hasOwnProperty('date') && paramOptions[opt].hasOwnProperty('time')) {
                                        valStr = paramOptions[opt].date + ' ' + paramOptions[opt].time;
                                    } else if (paramOptions[opt].hasOwnProperty('time')) {
                                        valStr = paramOptions[opt].time;
                                    } else if (paramOptions[opt].hasOwnProperty('date')) {
                                        valStr = paramOptions[opt].date;
                                    } else if (paramOptions[opt].hasOwnProperty('title')) { // form option: file
                                        valStr = JSON.stringify([paramOptions[opt]]);;
                                    } else {
                                        valStr = JSON.stringify(paramOptions[opt]);
                                    }
                                } else if (paramOptions[opt] instanceof Array) {
                                    valStr = JSON.stringify(paramOptions[opt]);
                                } else {
                                    valStr = paramOptions[opt];
                                }
                                customizedOptions.push({ id: Number(opt), value_string: valStr.toString() });
                            }

                            const dataArray = [
                                {
                                    data: {
                                        quantity: Number(params.qty),
                                        sku
                                    },
                                    customizable_options: customizedOptions
                                }
                            ];
                            variableParams = {
                                cartId,
                                data: dataArray
                            };
                        } else {
                            variableParams = {
                                cartId,
                                quantity: params.qty,
                                sku: sku,
                                downloadableProductLinks: listLinks
                            };
                        }

                        break;
                    case 'grouped':
                        if (!params.hasOwnProperty('super_group') ||
                            (params.hasOwnProperty('super_group') &&
                                Object.values(params.super_group).every(x => (x === "0")))
                        ) {
                            showToastMessage(Identify.__('Please specify the quantity of product(s).'));
                            return;
                        }
                        const { super_group } = params;
                        let dataItem = [];
                        for (const c in super_group) {
                            if (Number(super_group[c]) !== 0) {
                                const simpleItem = items.find(({ product }) => product.id === Number(c));
                                if (simpleItem) {
                                    const sItem = {
                                        data: {
                                            quantity: Number(super_group[c]),
                                            sku: simpleItem.product.sku
                                        }
                                    };
                                    dataItem.push(sItem);
                                }
                            }
                        }

                        variableParams = {
                            cartId,
                            data: dataItem
                        };
                        break;
                    case 'simple':
                    case 'virtual':
                        if (options) {
                            if (!params.hasOwnProperty('options')) {
                                showToastMessage(Identify.__('Please select the options required (*)'));
                                return;
                            }
                            const paramOptions = params.options;
                            let customizedOptions = [];
                            for (const opt in paramOptions) {
                                if (!paramOptions[opt] || (paramOptions[opt] instanceof Array && paramOptions[opt].length < 1)
                                    || (paramOptions[opt] instanceof Object && Object.keys(paramOptions[opt]).length < 1)) continue;

                                let valStr = '';
                                if (paramOptions[opt] instanceof Object) {
                                    if (paramOptions[opt].hasOwnProperty('date') && paramOptions[opt].hasOwnProperty('time')) {
                                        valStr = paramOptions[opt].date + ' ' + paramOptions[opt].time;
                                    } else if (paramOptions[opt].hasOwnProperty('time')) {
                                        valStr = paramOptions[opt].time;
                                    } else if (paramOptions[opt].hasOwnProperty('date')) {
                                        valStr = paramOptions[opt].date;
                                    } else if (paramOptions[opt].hasOwnProperty('title')) { // form option: file
                                        valStr = JSON.stringify([paramOptions[opt]]);;
                                    } else {
                                        valStr = JSON.stringify(paramOptions[opt]);
                                    }
                                } else if (paramOptions[opt] instanceof Array) {
                                    valStr = JSON.stringify(paramOptions[opt]);
                                } else {
                                    valStr = paramOptions[opt];
                                }
                                customizedOptions.push({ id: Number(opt), value_string: valStr.toString() });
                            }

                            const dataArray = [
                                {
                                    data: {
                                        quantity: Number(params.qty),
                                        sku
                                    },
                                    customizable_options: customizedOptions
                                }
                            ];
                            variableParams = {
                                cartId,
                                data: dataArray
                            };

                        }
                        break;
                }

                showFogLoading();
                mutation({ variables: variableParams });
            }
        }
    }

    render() {
        hideFogLoading()
        const { productOptions, props, state, addToCompare } = this;
        const { optionCodes, optionSelections } = state;
        const { isQuickView, history, toggleMessages } = props;
        const product = prepareProduct(props.product);

        const product_url = `/${product.url_key}${productUrlSuffix()}`;
        const { type_id, name, simiExtraField, sku, stock_status, description, short_description,
            review_count, rating_summary, product_links, price_tiers } = product;
        const short_desc = (short_description && short_description.html) ? short_description.html : ''

        let stockLabel = Identify.__('In stock');
        let hasStock = true;
        if (stock_status && stock_status === 'OUT_OF_STOCK') {
            stockLabel = Identify.__('Out of stock');
            hasStock = false;
        }


        let mutationType = ADD_SIMPLE_MUTATION;
        switch (type_id) {
            case 'configurable':
                mutationType = ADD_CONFIGURABLE_MUTATION;
                break;
            case 'bundle':
                mutationType = ADD_BUNDLE_MUTATION;
                break;
            case 'downloadable':
                if (product.hasOwnProperty('options') && product.options) {
                    mutationType = ADD_DOWNLOADABLE_AND_CUSTOM_OPT_MUTATION;
                } else {
                    mutationType = ADD_DOWNLOADABLE_MUTATION;
                }
                break;
            case 'grouped':
                mutationType = ADD_GROUP_AND_CUSTOM_OPT_MUTATION;
                break;
            case 'simple':
                if (product.hasOwnProperty('options') && product.options) {
                    mutationType = ADD_GROUP_AND_CUSTOM_OPT_MUTATION;
                }
                break;
            case 'virtual':
                if (product.hasOwnProperty('options') && product.options) {
                    mutationType = ADD_VIRTUAL_CUSTOM_OPT_MUTATION
                } else {
                    mutationType = ADD_VIRTUAL_MUTATION;
                }
                break;
            default: break;
        }

        const addCartButton = (<SimiMutation mutation={mutationType} key={Identify.randomString(3)}>
            {(addProductCall, { data, error }) => {
                if (data || error) {
                    hideFogLoading();
                }
                if (error) {
                    let derivedErrorMessage;
                    if (error.graphQLErrors) {
                        derivedErrorMessage = error.graphQLErrors.map(({ message }) => message).join(', ');
                    } else {
                        derivedErrorMessage = error.message;
                    }
                    showToastMessage(derivedErrorMessage);
                }
                if (data) {
                    showToastSuccess("Add product to cart successful!");
                }

                return (
                    <Colorbtn
                        style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}
                        className="add-to-cart-btn"
                        onClick={() => this.mutationAction(addProductCall, sku)}
                        text={Identify.__('Add to Cart')} />
                )
            }}
        </SimiMutation>);

        const listLinkRelated = product_links && product_links.length && product_links.filter(({ link_type }) => link_type === 'related');
        const listLinkCrossSell = product_links && product_links.length && product_links.filter(({ link_type }) => link_type === 'crosssell');

        return (
            <div className={`container product-detail-root ${isQuickView ? 'quickview' : ''}`}>
                {this.breadcrumb(product)}
                {TitleHelper.renderMetaHeader({
                    title: product.meta_title ? product.meta_title : product.name ? product.name : '',
                    desc: product.meta_description ? product.meta_description : product.description ? product.description : ''
                })}
                <div className="image-carousel">
                    <ProductImage
                        optionCodes={optionCodes}
                        optionSelections={optionSelections}
                        product={product}
                        showStatus={false}
                        hasStock={hasStock}
                        autoPlay={isQuickView ? false : true}
                    />
                </div>
                <div className="main-actions">
                    <div className="title">
                        <h1 className="product-name">
                            <span>{ReactHTMLParse(name)}</span>
                        </h1>
                    </div>
                    {sku && <div className={`product-sku flex`} id="product-sku">
                        <span className='sku-label'>{Identify.__('Sku') + ": "} {sku}</span>
                    </div>}
                    <div role="presentation" className="review-btn" onClick={() => isQuickView ? history.push(product_url) : this.handleAddYourReview()}>
                        {!review_count ? Identify.__('Be the first to review this product') : Identify.__('Add your review')}
                    </div>
                    <div className="top-review"><TopReview app_reviews={review_count ? { rate: rating_summary, number: review_count } : { rate: 0, number: 0 }} />
                        {stockLabel && <div className="product-stock-status">{stockLabel}</div>}
                    </div>
                    <div className="product-price">
                        <ProductPrice ref={(price) => this.Price = price} data={product} configurableOptionSelection={optionSelections} />
                    </div>
                    {price_tiers && <TierPrices price_tiers={price_tiers} />}
                    {short_desc && <div className="product-short-desc">{ReactHTMLParse(short_desc)}</div>}
                    <div className="options">{productOptions}</div>
                    {type_id !== 'grouped' && hasStock ?
                        <div className="product-qty-content">
                            <span className="amount-qty">{Identify.__("Amount")}</span>
                            <Quantity initialValue={this.quantity} onValueChange={this.setQuantity} />
                        </div> : null}
                    <div className="cart-actions">
                        {!isQuickView && hasStock ? <div className="add-to-cart-ctn" style={{ border: `1px solid ${configColor.button_background}` }}>{addCartButton}</div> : ''}
                        <WishlistHeart params={this.prepareParams()} toggleMessages={toggleMessages} />
                        <div className="compare-actions">
                            <div role="presentation" onClick={addToCompare}>
                                <span className="icon-sync" />
                            </div>
                            <CompareProduct
                                openModal={this.state.showModalCompare}
                                closeModal={this.closeModalCompare}
                                history={this.props.history}
                                compareData={this.state.compare}
                                updateCompare={() => this.updateCompareList()}
                                isSignedIn={this.props.isSignedIn}
                            />
                        </div>
                        {isQuickView && <React.Fragment>
                            {hasStock && <div className="add-cart quick-action" role="presentation">
                                {addCartButton}
                            </div>}
                            <div className="goto-product quick-action" role="presentation" onClick={() => history.push(product_url)}>
                                <div className="action">{Identify.__('Go to product')}</div>
                            </div>
                        </React.Fragment>}
                    </div>
                    {/* <div className="social-share"><SocialShare id={product.id} className="social-share-item" /></div> */}
                </div>
                {!isQuickView && <div className="product-informations">
                    <Tabs activeItem={0} scrollTo={() => smoothScrollToView($('#product-detail-new-review'))} objRef={(tabs) => this.tabs = tabs}>
                        <div label={Identify.__('Detail')}>
                            {description && <div className="description"><Description description={description} /></div>}
                        </div>
                        <div label={Identify.__('More Information')}>
                            {(simiExtraField && simiExtraField.additional && Object.keys(simiExtraField.additional).length) ? <div className="techspec"><Techspec product={product} /></div> : ''}
                        </div>
                        <div label={Identify.__('Reviews')}>
                            <ReviewList sku={sku} rate={rating_summary} review_count={review_count} product={product} />
                        </div>
                    </Tabs>
                </div >}
                {!isQuickView && <LinkedProduct product_links={listLinkRelated} link_type="related" history={history} showCarousel={true} />}
                {!isQuickView && <LinkedProduct product_links={listLinkCrossSell} link_type="crosssell" history={history} />}
            </div >
        );
    }
}

ProductFullDetail.propTypes = {
    product: shape({
        __typename: string,
        id: number,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: object
    }).isRequired
};

export default ProductFullDetail;
