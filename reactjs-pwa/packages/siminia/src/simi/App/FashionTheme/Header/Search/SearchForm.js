import React, { useState, useEffect, useCallback, useRef } from 'react'
import Identify from "src/simi/Helper/Identify";
import SearchAutoComplete from './searchAutoComplete/index'

const SearchForm = props => {
    const { isPhone, showSearchForm } = props
    const searchField = useRef(null);
    const [showAC, setShowAC] = useState(false)
    const [searchVal, setSearchVal] = useState('')

    useEffect(() => {
        if (showSearchForm && searchField && searchField.current && isPhone)
            searchField.current.focus();
    }, [searchField, showSearchForm, isPhone]);

    const startSearch = (e) => {
        if (searchVal) {
            props.history.push(`/search.html?query=${searchVal}`)
            setShowAC(false)
            e.target.blur();
        }
    }
    const handleSearchField = () => {
        if (searchField.current.value) {
            setShowAC(true)
            if (searchField.current.value !== searchVal)
                setSearchVal(searchField.current.value)
        } else {
            setShowAC(false)
        }
    }

    const waitingClass = showSearchForm ? '' : 'waiting';

    const renderHtml = () => {
        let formClass = ''
        if (!props.outerComponent) {
            formClass = ' ' + waitingClass
        }
        return (
            <div id="header-search-form" className={'header-search-form' + formClass}>
                {showSearchForm &&
                    <>
                        <label htmlFor="siminia-search-field" className="hidden">{Identify.__('Search')}</label>
                        <i className="icon-magnifier icons" onClick={() => startSearch()} role="presentation"></i>
                        <input
                            type="text"
                            id="siminia-search-field"
                            ref={searchField}
                            className="search"
                            onChange={() => handleSearchField()}
                            onKeyPress={(e) => { if (e.key === 'Enter') startSearch(e) }}
                            placeholder={Identify.__('Search')}
                        />
                        <SearchAutoComplete visible={showAC} setVisible={setShowAC} value={searchVal} />
                    </>
                }
            </div>
        );
    }

    if (props.outerComponent) {
        const OuterComponent = props.outerComponent
        return (
            <OuterComponent
                className={`header-search ${waitingClass} ${Identify.isRtl() ? 'rtl-header-search' : ''}`}
            >
                {renderHtml()}
            </OuterComponent>
        )
    }

    return renderHtml();
}

export default SearchForm
