import React from 'react';
import OptionBase from '../OptionBase';
import Checkbox from '../OptionType/Checkbox';
import ReactHTMLParse from 'react-html-parser';

require('./downloadableoptions.scss');

class DownloadableOptions extends OptionBase {
    constructor(props) {
        super(props);
        this.exclT = 0;
        this.inclT = 0;
    }

    renderOptions = () => {
        const objOptions = [];
        let optionSelect = null;
        if (this.data.downloadable_product_links) {
            const { downloadable_product_links, links_purchased_separately, links_title } = this.data;

            for (const i in downloadable_product_links) {
                const attribute = downloadable_product_links[i];
                if (links_purchased_separately) {
                    this.required.push(attribute.id)
                }
                const element = this.renderAttribute(attribute);
                objOptions.push(element);
            }

            const required = links_purchased_separately ? this.renderLabelRequired() : '';

            optionSelect = <div className="option-select">
                {links_title && <div className="option-title">
                    <span>{links_title} {required}</span>
                </div>}
                {objOptions}
            </div>
        }
        return (
            <div>
                <form id="downloadableOption" className="options-container">
                    {optionSelect}
                </form>
            </div>
        );
    };

    renderAttribute = (attribute) => {
        return (
            <div className="option-content" key={attribute.id}>
                <div className="options-list">
                    {this.renderMultiCheckbox(attribute)}
                </div>
            </div>
        )
    };

    renderMultiCheckbox = (ObjOptions) => {
        const { links_purchased_separately } = this.data;

        return <div className="option-row">
            {links_purchased_separately ? <Checkbox id={ObjOptions.id} title={ObjOptions.title} value={ObjOptions.id} parent={this} item={ObjOptions} /> : ReactHTMLParse(ObjOptions.title)}
        </div>;
    };

    updatePrices = (selected = this.selected) => {
        let exclT = 0;
        let inclT = 0;
        const downloadableOptions = this.data.downloadable_product_links;
        for (const d in downloadableOptions) {
            const option = downloadableOptions[d];
            if (selected && selected instanceof Object && Object.keys(selected).length){
                if (selected[option.id] && selected[option.id] instanceof Array && selected[option.id].length ){
                    exclT += parseFloat(option.price);
                    inclT += parseFloat(option.price);
                }
            }

            /* const values = option.value;
            for (const v in values) {
                const value = values[v];
                if (Array.isArray(selected)) {
                    if (selected.indexOf(value.id) !== -1) {
                        if (value.price_excluding_tax) {
                            exclT += parseFloat(value.price_excluding_tax.price);
                            inclT += parseFloat(value.price_including_tax.price);
                        } else {
                            //excl and incl is equal when server return only one price
                            exclT += parseFloat(value.price);
                            inclT += parseFloat(value.price);
                        }
                    }
                } else {
                    if (value.id === selected) {
                        //add price
                        if (value.price_excluding_tax) {
                            exclT += parseFloat(value.price_excluding_tax.price);
                            inclT += parseFloat(value.price_including_tax.price);
                        } else {
                            //excl and incl is equal when server return only one price
                            exclT += parseFloat(value.price);
                            inclT += parseFloat(value.price);
                        }
                    }
                }
            } */
        }
        this.parentObj.Price.setDownloadableOptionPrice(exclT, inclT);
    }

    /* checkOptionRequired = (selected = this.selected, required = this.required) => {
        let check = true;
        for (const i in required) {
            const requiredOptionId = required[i];
            if (!selected.hasOwnProperty(requiredOptionId) || !selected[requiredOptionId] || selected[requiredOptionId].length === 0) {
                check = false;
                break;
            }
        }
        return check;
    } */

    getParams = () => {
        if (!this.checkOptionRequired()) return false;
        this.selected = this.selected ? this.selected : {};
        this.setParamOption('links');
        return this.params;
    };


    renderSamples = () => {
        const { data } = this
        if (data.downloadable_product_samples && data.downloadable_product_samples.length) {
            const { downloadable_product_samples } = data;
            const returnedSamples = downloadable_product_samples.sort((a, b) => a.sort_order < b.sort_order).map((downloadSample, index) => {
                return (
                    <a key={index} href={downloadSample.sample_url} target="_blank" className="download-sample-item">
                        {downloadSample.title}
                    </a>
                )
            })
            return <div className="download-samples">
                <div className="download-sample-title">
                    {/* {downloadSamples.title} */}
                </div>
                {returnedSamples}
            </div>
        }
    }
    render() {
        return (
            <div className="downloadable-option">
                {this.renderOptions()}
                {this.renderSamples()}
            </div>
        )
    }
}
export default DownloadableOptions;
