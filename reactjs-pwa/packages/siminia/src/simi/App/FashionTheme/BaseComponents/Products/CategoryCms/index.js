import React from 'react';
import ReactHTMlParser from 'react-html-parser';
import Identify from 'src/simi/Helper/Identify';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner';
import { simiUseQuery } from 'src/simi/Network/Query';
import getCmsBlocks from '@magento/venia-ui/lib/queries/getCmsBlocks.graphql';
require('./style.scss');

const $ = window.$;

const CategoryCms = props => {
    const { cmsData, history } = props;

    let cmsIdentifier = null
    if (cmsData && cmsData.cms_identifier) {
        cmsIdentifier = cmsData.cms_identifier;
    }

    const renderJs = () => {
        $(document).on('click', '.category-cms-page a', function (e) {
            e.preventDefault();
            const href = $(this).attr('href');
            const arrayLink = href.split('""');
            if (arrayLink.length && arrayLink.length >= 2) {
                const link = arrayLink[1];
                history.push(link)
            } else {
                window.location.replace(link);
            }
        })
    }

    if (!cmsIdentifier) return (
        <div className="category-cms-page">
            <div className="no-cms">
                {Identify.__('This category is empty')}
            </div>
        </div>
    )

    if (cmsData.cms && cmsData.cms.indexOf('Error') === -1) {
        return (
            <div className="category-cms-page">
                {ReactHTMlParser(cmsData.cms)}
                {renderJs()}
            </div>
        )
    }

    const { data, error, loading } = simiUseQuery(getCmsBlocks, {
        variables: {
            identifiers: [cmsIdentifier]
        }
    })

    if (loading) {
        return <LoadingSpiner />
    }

    if (error) {
        <div className="category-cms-page">{Identify.__("The Cms Block doesn't exit")}</div>
    }

    if (data && data.cmsBlocks && data.cmsBlocks.items && data.cmsBlocks.items.length && data.cmsBlocks.items.length > 0) {
        const cms = data.cmsBlocks.items[0];

        return (
            <div className="category-cms-page">
                {cms.content && ReactHTMlParser(cms.content)}
                {renderJs()}
            </div>
        )
    }

    return null
}

export default CategoryCms;
