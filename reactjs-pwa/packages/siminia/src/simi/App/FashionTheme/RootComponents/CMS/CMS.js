import React from 'react';
import LoadingSpiner from 'src/simi/BaseComponents/Loading/LoadingSpiner'
import getCmsPageQuery from '@magento/venia-ui/lib/queries/getCmsPage.graphql';
import Identify from 'src/simi/Helper/Identify';
import { Simiquery } from 'src/simi/Network/Query'
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import ReactHTMLParser from 'react-html-parser';
import TitleHelper from 'src/simi/Helper/TitleHelper';

require('./cms.scss');
require('./policy.scss');
require('./term-condition.scss');

const $ = window.$;
const CMS = (props) => {

    const { id } = props;

    const variables = {
        id,
        onServer: true
    }
    smoothScrollToView($('#root'));

    const renderJs = () => {
        $(document).ready(function () {
            $('.readmore-next-content').on('click', function () {
                $(this).hide();
                $(this).next('.hidden-content').show(250);
            });

            // term and condition page
            $
            $('.term-and-condition-page .page-content > ul').on('click', function () {
                console.log('run')
                $(this).find('ul').slideToggle();
            });

            $('.term-and-condition-page .page-content > ul > li > ul').on('click', function (event) {
                event.stopPropagation();
            })
        });
    }

    return <Simiquery query={getCmsPageQuery} variables={variables}>
        {({ loading, error, data }) => {
            if (error) return <div>Data Fetch Error</div>;
            if (!data || loading) return <LoadingSpiner />;

            return <div className="container">
                {TitleHelper.renderMetaHeader({
                    title: data.cmsPage.meta_title ? data.cmsPage.meta_title : data.cmsPage.title,
                    description: data.cmsPage.meta_description ? data.cmsPage.meta_description : ''
                })}
                <div className="static-page international-page">
                    {data.cmsPage && data.cmsPage.content ? ReactHTMLParser(data.cmsPage.content) : Identify.__("Not found content")}
                    {renderJs()}
                </div>
            </div>
        }}
    </Simiquery>
}

export default CMS;
