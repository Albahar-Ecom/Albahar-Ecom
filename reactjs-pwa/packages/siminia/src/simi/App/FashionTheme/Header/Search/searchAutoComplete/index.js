import React, { useEffect, useRef, useMemo } from 'react';
import { simiUseLazyQuery as useLazyQuery } from 'src/simi/Network/Query'
import searchQuery from 'src/simi/queries/catalog/productSearch.graphql'
import Suggestions from './suggestions';
import Identify from 'src/simi/Helper/Identify'
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import { bool, func } from 'prop-types';
import debounce from 'lodash.debounce';

require('./searchAutoComplete.scss');

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

    //handle click outsite
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, setVisible);
    let message = '';

    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(searchQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // Create a debounced function so we only search some delay after the last
    // keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText } });
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

    let data
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
        <div className={`search-auto-complete-root ${visible ? 'visible' : 'hidden'}`} ref={wrapperRef}>
            <div className="message">
                {message}
                <div role="button" tabIndex="0" className='close-icon'
                    onClick={() => setVisible(false)} onKeyUp={() => setVisible(false)}>
                    <i className="icon-cross" />
                </div>
            </div>
            <div className="suggestions">
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
    setVisible: func,
    visible: bool
};
