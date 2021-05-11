import { useEffect, useState, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product';
import { usePagination } from '@magento/peregrine';
import { useSimiPagination } from 'src/simi/talons/Pagination/useSimiPagination';
import { useHistory } from 'react-router-dom';
import { getDataFromUrl } from 'src/simi/Helper/Url';

let sortByData = null;
let filterData = null;
let loadedData = null;

// use pagination follow site magento default ( change both page and pagesize)
export const useCategoryContentSimiPagination = props => {
    const {
        categoryId,
        brandData,
        brandLoading,
        queries: { getCategory },
        parameter1,
        parameter2,
        initialTotalPages,
        defaultInitialPageSize,
        defaultInitialPage
    } = props;

    const history = useHistory();
    const pathname = history.location.search ? history.location.search : history.location.pathname;

    const dataFromDict = useMemo(() => {
        return getDataFromUrl(pathname);
    }, [history, pathname]);

    const [paginationValues, paginationApi] = useSimiPagination({
        parameter1: parameter1,
        parameter2: parameter2,
        initialTotalPages: initialTotalPages,
        defaultInitialPageSize: defaultInitialPageSize,
        defaultInitialPage: defaultInitialPage
    });

    const {
        startPage,
        endPage,
        pageSize,
        currentPage,
        totalPages
    } = paginationValues;
    const {
        setStartPage,
        setEndPage,
        setCurrentPageAndLimit,
        setTotalPages
    } = paginationApi;

    sortByData = null;
    const productListOrder = Identify.findGetParameter('product_list_order');
    const productListDir = Identify.findGetParameter('product_list_dir');
    const newSortByData = productListOrder
        ? productListDir
            ? { [productListOrder]: productListDir.toUpperCase() }
            : { [productListOrder]: 'ASC' }
        : null;
    if (
        newSortByData &&
        (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))
    ) {
        sortByData = newSortByData;
    }

    let brandInfo = null
    if(brandData && brandData.mpbrand && brandData.mpbrand.items && brandData.mpbrand.items.length > 0) {
        brandInfo = brandData.mpbrand.items[0]
    }

    filterData = null;
    let productListFilter = Identify.findGetParameter('filter');
    productListFilter = productListFilter ? JSON.parse(productListFilter) : {};
    if(brandInfo && brandInfo.option_id) {
        productListFilter.brand = [brandInfo.option_id]
    }
    filterData = JSON.stringify(productListFilter);

    // if(optionId) {
    //     productListFilter.brand = [optionId]
    // }
    // console.log(props)
    // console.log(productListFilter)
    // filterData = JSON.stringify(productListFilter);
    // console.log(filterData)
    // // if (productListFilter) {
    // //     if (JSON.parse(productListFilter)) {
    // //         filterData = productListFilter;
    // //     }
    // // }

    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(getCategory, { fetchPolicy: 'no-cache' });

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId)
    };
    if (filterData) variables.simiFilter = filterData;
    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (categoryId && (!dataFromDict || !dataFromDict.simiproducts)) {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            if(brandInfo) {
                getProductsByCategory({ variables, skip: dataFromDict && dataFromDict.simiproducts });
            }
        }
    }, [
        brandInfo,
        categoryId,
        getProductsByCategory,
        currentPage,
        pageSize,
        filterData,
        productListOrder,
        productListDir,
        dataFromDict
    ]);

    const setPageTo = useCallback(
        (page, pageSize) => {
            setCurrentPageAndLimit(page, pageSize);
            document
                .getElementById('root-product-list')
                .scrollIntoView({ behavior: 'smooth' });
        },
        [setCurrentPageAndLimit]
    );

    const products = useMemo(() => {
        let productsData = null;
        if (dataFromDict && dataFromDict.simiproducts) {
            productsData = dataFromDict;
        } else if (oriProductsData)
            productsData = JSON.parse(JSON.stringify(oriProductsData))

        if (productsData && productsData.simiproducts) {
            productsData.products = applySimiProductListItemExtraField(
                productsData.simiproducts
            );
            if (productsData.products.simi_filters)
                productsData.products.filters =
                    productsData.products.simi_filters;
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [oriProductsData, dataFromDict]);

    const pageControl = {
        startPage,
        endPage,
        setStartPage,
        setEndPage,
        currentPage,
        setPageAndLimit: setPageTo,
        totalPages
    };

    const totalPagesFromData =
        products && products.simiproducts
            ? products.simiproducts.page_info.total_pages
            : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const appliedFilter = filterData ? productListFilter : null;

    const cateEmpty =
        !appliedFilter &&
            products &&
            products.simiproducts &&
            products.simiproducts.total_count === 0
            ? true
            : false;

    const cmsData =
        products && products.category && products.category.simiCategoryCms
            ? products.category.simiCategoryCms
            : null;

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        cmsData,
        pageControl,
        brandInfo
    };
};
