import { useEffect, useState, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product';
import { usePagination } from '@magento/peregrine';
import { useSimiPagination } from 'src/simi/talons/Pagination/useSimiPagination';
import { useHistory } from 'react-router-dom';
import { getDataFromUrl } from 'src/simi/Helper/Url';
import {getStore} from '../../Helper/Data'

let sortByData = null;
let filterData = null;
let loadedData = null;

export const useCategoryContent = props => {
    const {
        categoryId,
        productsPageDesktop,
        productsPagePhone,
        queries: { getCategory }
    } = props;

    const [thisPage, setThisPage] = useState(false);

    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize
        ? Number(pageSize)
        : window.innerWidth < 1024
            ? productsPagePhone
            : productsPageDesktop;

    const paramPage = Identify.findGetParameter('page');
    const [currentPage, setCurrentPage] = useState(
        paramPage ? Number(paramPage) : 1
    );

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

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(getCategory/* , { fetchPolicy: 'no-cache' } */);

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId)
    };
    if (filterData) variables.simiFilter = filterData;
    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (categoryId) {
            getProductsByCategory({ variables });
        }
    }, [categoryId, getProductsByCategory, currentPage]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            setThisPage(true);
        },
        [setCurrentPage, setThisPage]
    );

    const products = useMemo(() => {
        let productsData
        if (oriProductsData)
            productsData = JSON.parse(JSON.stringify(oriProductsData))

        if (productsData && productsData.simiproducts) {
            productsData.products = applySimiProductListItemExtraField(
                productsData.simiproducts
            );
            if (productsData.products.simi_filters)
                productsData.products.filters =
                    productsData.products.simi_filters;

            // concat data when load more button clicked
            const stringVar = JSON.stringify({
                ...variables,
                ...{ currentPage: 0 }
            });
            if (
                !loadedData ||
                !loadedData.vars ||
                loadedData.vars !== stringVar
            ) {
                loadedData = productsData;
            } else {
                let loadedItems = loadedData.products.items;
                const newItems = productsData.products.items;
                loadedItems = loadedItems.concat(newItems);
                for (var i = 0; i < loadedItems.length; ++i) {
                    for (var j = i + 1; j < loadedItems.length; ++j) {
                        if (
                            loadedItems[i] &&
                            loadedItems[j] &&
                            loadedItems[i].id === loadedItems[j].id
                        )
                            loadedItems.splice(j--, 1);
                    }
                }
                loadedData.products.items = loadedItems;
            }
            loadedData.vars = stringVar;
            if (
                loadedData &&
                loadedData.category &&
                parseInt(loadedData.category.id) === parseInt(categoryId)
            )
                return loadedData;
        } else if (loadedData && thisPage) {
            // keep previous data when click load more button
            return loadedData;
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [oriProductsData, categoryId]);

    const totalPagesFromData =
        products && products.simiproducts
            ? products.simiproducts.page_info.total_pages
            : null;

    const pageControl = {
        currentPage,
        setPage: setPageTo,
        totalPages: totalPagesFromData
    };

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

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
        pageControl
    };
};

// use default venia pagination ( only change page, not change pagesize)
export const useCategoryContentPagination = props => {
    const {
        categoryId,
        productsPageDesktop,
        productsPagePhone,
        queries: { getCategory }
    } = props;

    const [paginationValues, paginationApi] = usePagination();
    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize
        ? Number(pageSize)
        : window.innerWidth < 1024
            ? productsPagePhone
            : productsPageDesktop;

    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

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

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(getCategory);

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId)
    };
    if (filterData) variables.simiFilter = filterData;
    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (categoryId) {
            getProductsByCategory({ variables });
        }
    }, [categoryId, getProductsByCategory, currentPage]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        },
        [setCurrentPage]
    );

    const products = useMemo(() => {
        let productsData
        if (oriProductsData)
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
    }, [oriProductsData]);

    const pageControl = {
        currentPage,
        setPage: setPageTo,
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

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

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
        pageControl
    };
};

// use pagination follow site magento default ( change both page and pagesize)
export const useCategoryContentSimiPagination = props => {
    const {
        categoryId,
        queries: { getCategory },
        parameter1,
        parameter2,
        initialTotalPages,
        defaultInitialPageSize,
        defaultInitialPage
    } = props;

    const store = getStore();
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

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const [
        getProductsByCategory,
        { data: oriProductsData, error: error, loading: loading }
    ] = useLazyQuery(getCategory, { fetchPolicy: 'no-cache' });

    const variables = {
        id: Number(categoryId),
        pageSize: pageSize,
        currentPage: currentPage,
        stringId: String(categoryId),
        cacheKeyStoreId: String(store.id || 1)
    };

    if (filterData) variables.simiFilter = filterData;
    let simiSortByData = {}
    for(let attribute in sortByData) {
        const sortAttributeValue = sortByData[attribute]
        simiSortByData.attribute = attribute
        simiSortByData.direction = sortAttributeValue
    }
    if (sortByData) variables.simiProductSort = simiSortByData;

    useEffect(() => {
        if (categoryId && (!dataFromDict || !dataFromDict.simiproducts)) {
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            getProductsByCategory({ variables, skip: dataFromDict && dataFromDict.simiproducts });
        }
    }, [
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

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

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
        pageControl
    };
};
