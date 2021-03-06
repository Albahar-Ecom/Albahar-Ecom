import { useEffect, useState, useMemo, useCallback } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query';
import Identify from 'src/simi/Helper/Identify';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product';
import getQueryParameterValue from 'src/util/getQueryParameterValue';
import { usePagination } from '@magento/peregrine';
import { useSimiPagination } from 'src/simi/talons/Pagination/useSimiPagination';

let sortByData = null;
let filterData = null;
let loadedData = null;

export const useSearchContent = props => {
    const {
        location,
        productsPageDesktop,
        productsPagePhone,
        queries: { getProductSearch }
    } = props;

    const [thisPage, setThisPage] = useState(false);

    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize ? Number(pageSize) : window.innerWidth < 1024 ? productsPagePhone : productsPageDesktop;

    const paramPage = Identify.findGetParameter('page');
    const [currentPage, setCurrentPage] = useState(paramPage ? Number(paramPage) : 1);

    sortByData = null;
    const productListOrder = Identify.findGetParameter('product_list_order');
    const productListDir = Identify.findGetParameter('product_list_dir');
    const newSortByData = productListOrder ? productListDir ? { [productListOrder]: productListDir.toUpperCase() } : { [productListOrder]: 'ASC' } : null;
    if (newSortByData && (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))) {
        sortByData = newSortByData;
    }

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const inputText = getQueryParameterValue({ location, queryParameter: 'query' });

    const categoryId = getQueryParameterValue({ location, queryParameter: 'category' });

    const [getProductsBySearch, { data: productsData, error: error, loading: loading }] = useLazyQuery(
        getProductSearch, { fetchPolicy: 'no-cache' }
    );

    const variables = {
        pageSize: pageSize,
        currentPage: currentPage
    };

    if (categoryId) {
        variables.categoryId = categoryId;
    }
    if (inputText) {
        variables.inputText = inputText;
    }

    if (filterData)
        variables.simiFilter = filterData;
    if (sortByData)
        variables.sort = sortByData;

    useEffect(() => {
        if (inputText) {
            getProductsBySearch({ variables });
        }
    }, [inputText, getProductsBySearch, currentPage]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            setThisPage(true);
        }, [setCurrentPage, setThisPage]);

    const products = useMemo(() => {
        if (productsData && productsData.simiproducts) {
            productsData.products = applySimiProductListItemExtraField(productsData.simiproducts);
            if (productsData.products.simi_filters) productsData.products.filters = productsData.products.simi_filters;

            // concat data when load more button clicked
            const stringVar = JSON.stringify({ ...variables, ...{ currentPage: 0 } })
            if (!loadedData || !loadedData.vars || loadedData.vars !== stringVar) {
                loadedData = productsData
            } else {
                let loadedItems = loadedData.products.items;
                const newItems = productsData.products.items;
                loadedItems = loadedItems.concat(newItems);
                for (var i = 0; i < loadedItems.length; ++i) {
                    for (var j = i + 1; j < loadedItems.length; ++j) {
                        if (loadedItems[i] && loadedItems[j] && loadedItems[i].id === loadedItems[j].id)
                            loadedItems.splice(j--, 1);
                    }
                }
                loadedData.products.items = loadedItems;
            }
            loadedData.vars = stringVar;
            // if (loadedData && loadedData.category && parseInt(loadedData.category.id) === parseInt(categoryId))
            return loadedData;

        } else if (loadedData && thisPage) {
            // keep previous data when click load more button
            return loadedData;
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [productsData, categoryId]);

    const totalPagesFromData = products && products.simiproducts ? products.simiproducts.page_info.total_pages : null;

    const pageControl = {
        currentPage,
        setPage: setPageTo,
        totalPages: totalPagesFromData
    };

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

    const cateEmpty = (!appliedFilter && products && products.simiproducts && products.simiproducts.total_count === 0) ? true : false;

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        pageControl,
        inputText
    };
}

export const useSearchContentPagination = props => {
    const {
        location,
        productsPageDesktop,
        productsPagePhone,
        queries: { getProductSearch }
    } = props;

    const [paginationValues, paginationApi] = usePagination();
    let pageSize = Identify.findGetParameter('product_list_limit');
    pageSize = pageSize ? Number(pageSize) : window.innerWidth < 1024 ? productsPagePhone : productsPageDesktop;

    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    sortByData = null;
    const productListOrder = Identify.findGetParameter('product_list_order');
    const productListDir = Identify.findGetParameter('product_list_dir');
    const newSortByData = productListOrder ? productListDir ? { [productListOrder]: productListDir.toUpperCase() } : { [productListOrder]: 'ASC' } : null;
    if (newSortByData && (!sortByData || !ObjectHelper.shallowEqual(sortByData, newSortByData))) {
        sortByData = newSortByData;
    }

    filterData = null;
    const productListFilter = Identify.findGetParameter('filter');
    if (productListFilter) {
        if (JSON.parse(productListFilter)) {
            filterData = productListFilter;
        }
    }

    const inputText = getQueryParameterValue({ location, queryParameter: 'query' });

    const categoryId = getQueryParameterValue({ location, queryParameter: 'category' });

    const [getProductsBySearch, { data: productsData, error: error, loading: loading }] = useLazyQuery(
        getProductSearch
    );

    const variables = {
        pageSize: pageSize,
        currentPage: currentPage
    }

    if (categoryId) {
        variables.categoryId = categoryId;
    }
    if (inputText) {
        variables.inputText = inputText;
    }

    if (filterData)
        variables.simiFilter = filterData;
    if (sortByData)
        variables.sort = sortByData;

    useEffect(() => {
        if (inputText) {
            getProductsBySearch({ variables });
        }
    }, [inputText, getProductsBySearch, currentPage]);

    const setPageTo = useCallback(
        page => {
            setCurrentPage(page);
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }, [setCurrentPage]);

    const products = useMemo(() => {
        if (productsData && productsData.simiproducts) {
            productsData.products = applySimiProductListItemExtraField(productsData.simiproducts);
            if (productsData.products.simi_filters) productsData.products.filters = productsData.products.simi_filters;
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return productsData;
    }, [productsData]);

    const pageControl = {
        currentPage,
        setPage: setPageTo,
        totalPages
    };

    const totalPagesFromData = products && products.simiproducts ? products.simiproducts.page_info.total_pages : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const appliedFilter = filterData ? JSON.parse(productListFilter) : null;

    const cateEmpty = (!appliedFilter && products && products.simiproducts && products.simiproducts.total_count === 0) ? true : false;

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        pageControl,
        inputText
    };
}

// use pagination follow site magento default ( change both page and pagesize)
export const useSearchContentSimiPagination = props => {
    const {
        location,
        queries: { getProductSearch },
        parameter1,
        parameter2,
        initialTotalPages,
        defaultInitialPageSize,
        defaultInitialPage
    } = props;

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

    const inputText = getQueryParameterValue({ location, queryParameter: 'query' });

    const categoryId = getQueryParameterValue({ location, queryParameter: 'category' });

    const [
        getProductsBySearch,
        { data: productsData, error: error, loading: loading }
    ] = useLazyQuery(getProductSearch, { fetchPolicy: 'no-cache' });

    const variables = {
        pageSize: pageSize,
        currentPage: currentPage
    };

    if (categoryId) {
        variables.categoryId = categoryId;
    }
    if (inputText) {
        variables.inputText = inputText;
    }

    if (filterData) variables.simiFilter = filterData;
    if (sortByData) variables.sort = sortByData;

    useEffect(() => {
        if (inputText) {
            getProductsBySearch({ variables });
        }
    }, [
        inputText,
        getProductsBySearch,
        currentPage,
        pageSize,
        filterData,
        productListOrder,
        productListDir
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
    }, [productsData]);

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

    return {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        pageControl,
        inputText
    };
};
