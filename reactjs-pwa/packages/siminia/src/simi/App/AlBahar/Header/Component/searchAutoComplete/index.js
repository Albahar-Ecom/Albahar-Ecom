import React, { useEffect, useRef, useMemo } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query'

import { mergeClasses } from 'src/classify';
import searchQuery from 'src/simi/App/AlBahar/queries/catalog/productSearch.graphql'
import Suggestions from './suggestions';
import Close from 'src/simi/BaseComponents/Icon/TapitaIcons/Close'
import defaultClasses from './searchAutoComplete.css';
import Identify from 'src/simi/Helper/Identify'
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import debounce from 'lodash.debounce';
import { useUserContext } from '@magento/peregrine/lib/context/user';

function useOutsideAlerter(ref, setVisible) {
    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target) && setVisible) {
            if (setVisible)
                setVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
}



const SearchAutoComplete = props => {
    const { setVisible, visible, value } = props;
    const [{ isSignedIn }] = useUserContext();
    //handle click outsite
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setVisible);

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = visible ? classes.root_visible : classes.root_hidden;
    let message = '';

    const options = {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    }
    const prepareVariables = {}
    if(isSignedIn) {
        prepareVariables.loginToken = Identify.randomString()
        options.nextFetchPolicy = 'network-only'
    }
    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(searchQuery, options);

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText, ...prepareVariables } });
            }, 500),
        [runSearch]
    );

    // run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (visible) {
            debouncedRunQuery(value);
        }
    }, [debouncedRunQuery, value, visible]);

    const { data: oriData, error, loading } = productResult;

    let data;
    if (oriData) {
        data = JSON.parse(JSON.stringify(oriData));
        data.products = applySimiProductListItemExtraField(data.simiproducts);
        // still need filters to get suggested categories
        // if (data.products.simi_filters)
        //     data.products.filters = data.products.simi_filters
    }

    if (error) {
        message = Identify.__('An error occurred while fetching results.');
    } else if (loading) {
        message = Identify.__('Fetching results...');
    } else if (!data) {
        message = Identify.__('Search for a product');
    } else if (!data.products.items.length) {
        message = Identify.__('No results were found.');
    } else {
        message = Identify.__('%s items').replace('%s', data.products.items.length);
    }

    return (
        <div className={rootClassName} ref={wrapperRef}>
            <div role="button" tabIndex="0" className={classes['close-icon']} onClick={() => setVisible(false)} onKeyUp={() => setVisible(false)}>
                <Close style={{ width: 14, height: 14, display: 'block' }} />
            </div>
            <div className={classes.message}>{message}</div>
            <div className={classes.suggestions}>
                <Suggestions
                    products={data ? data.products : {}}
                    searchValue={value}
                    setVisible={setVisible}
                    visible={visible}
                />
            </div>
        </div>
    );
};

export default SearchAutoComplete;

SearchAutoComplete.propTypes = {
    classes: shape({
        message: string,
        root_hidden: string,
        root_visible: string,
        suggestions: string
    }),
    setVisible: func,
    visible: bool
};