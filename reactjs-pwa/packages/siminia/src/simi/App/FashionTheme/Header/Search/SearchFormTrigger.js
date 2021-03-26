import React, { useEffect } from 'react'
const $ = window.$
const SearchFormTrigger = props => {
    const trigger = props.toggleSearch || (() => { })
    const addTriggerClickOutside = (e) => {
        if (document.getElementById('searchFormHeader') && !document.getElementById('searchFormHeader').contains(e.target) && !document.getElementById('header-search-form').contains(e.target)) {
            // click outside
            if (!$('.header-search').hasClass('waiting')) {
                // hide search form
                trigger()
            }
        }
    }
    window.addEventListener('click', addTriggerClickOutside);
    useEffect(() => {
        return () => {
            window.removeEventListener('click', addTriggerClickOutside);
        }
    })
    return (
        <div role="presentation" id="searchFormHeader" onClick={() => trigger()} className='search-trigger'>
            <i className="icon-magnifier icons"></i>
        </div>
    );
}
export default SearchFormTrigger