import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import OptionBase from '../OptionBase'
import Checkbox from '../OptionType/Checkbox';
import Radio from '../OptionType/Radio';
import Select from '../OptionType/Select';
import TextField from '../OptionType/Text';
import FileSelect from '../OptionType/File';
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent/'
import OptionLabel from '../OptionLabel'
import {validateEmpty} from 'src/simi/Helper/Validation'

require('./customoptions.scss');

const DatePicker = (props) => {
    return <LazyComponent component={() => import('../OptionType/Date')} {...props} />
}
const TimePicker = (props) => {
    return <LazyComponent component={() => import('../OptionType/Time')} {...props} />
}
class CustomOptions extends OptionBase {
    renderOptions = () => {
        if (this.data instanceof Object && this.data.hasOwnProperty('custom_options')) {
            const options = this.data.custom_options;
            console.log(options)
            if (!options) return <div></div>;
            const mainClass = this;
            const optionsHtml = options.map(function (item) {
                const labelRequired = mainClass.renderLabelRequired(item.required);
                if (item.required) {
                    mainClass.required.push(item.option_id);
                }

                let priceLabel = "";
                let itemType = '';
                let prLabel = {};
                let configField = {}
                // if (item.type === 'drop_down' || item.type === 'checkbox'
                //     || item.type === 'multiple' || item.type === 'radio') {
                // } else {
                //     priceLabel = <OptionLabel title={''} item={item.values[0]} />
                // }
                if (item.hasOwnProperty('checkbox_value')) {
                    itemType = 'checkbox';
                    configField = item.checkbox_value
                } else if (item.hasOwnProperty('dropdown_value')) {
                    itemType = 'drop_down';
                    configField = item.dropdown_value
                } else if (item.hasOwnProperty('multiple_value')) {
                    itemType = 'multiple';
                    configField = item.multiple_value
                } else if (item.hasOwnProperty('radio_value')) {
                    itemType = 'radio';
                    configField = item.radio_value
                } else if (item.hasOwnProperty('date_value')) {
                    itemType = 'date_time';
                    prLabel = item.date_value;
                    configField = item.date_value
                } else if (item.hasOwnProperty('field_value')) {
                    itemType = 'field';
                    prLabel = item.field_value;
                    configField = item.field_value
                } else if (item.hasOwnProperty('area_value')) {
                    itemType = 'area';
                    prLabel = item.area_value;
                    configField = item.area_value
                } else if (item.hasOwnProperty('file_value')) {
                    itemType = 'file';
                    prLabel = item.file_value;
                    configField = item.file_value
                }

                priceLabel = <OptionLabel title={''} item={prLabel} />

                return (
                    <div className="option-select" key={Identify.randomString(5)}>
                        <div className="option-title">
                            <span>{item.title}</span>
                            {labelRequired}
                            {priceLabel}
                        </div>
                        <div className="option-content">
                            <div className="option-list">
                                {mainClass.renderContentOption(item, itemType, configField)}
                                <p id={`error-option-${item.option_id}`} className="option-field-error"></p>
                            </div>
                        </div>
                    </div>
                );
            });

            if (!optionsHtml.length) {
                return null;
            }

            return (
                <div className="custom-options">
                    <div id="customOption" style={{ marginTop: '10px' }}>
                        {optionsHtml}
                    </div>
                </div>
            );
        }
    }

    renderContentOption = (ObjOptions, type, configField) => {
        const id = ObjOptions.option_id;
        if (type === 'multiple' || type === 'checkbox') {
            return this.renderMutilCheckbox(ObjOptions, id)
        }
        if (type === 'radio') {
            return <Radio data={ObjOptions} id={id} parent={this} configField={configField} />
        }
        if (type === 'drop_down' || type === 'select') {
            return <div style={{ marginTop: -10 }}>
                <Select data={ObjOptions} id={id} parent={this} configField={configField} />
            </div>
        }
        if (type === 'date') {
            return <div style={{ marginTop: -10 }}>
                <DatePicker data={ObjOptions} id={id} parent={this} />
            </div>
        }
        if (type === 'time') {
            return <div style={{ marginTop: -10 }}>
                <TimePicker data={ObjOptions} id={id} parent={this} />
            </div>
        }
        if (type === 'date_time') {
            return (
                <div style={{ marginTop: -10 }}>
                    <DatePicker data={ObjOptions} datetime={true} id={id} parent={this} />
                    <TimePicker data={ObjOptions} datetime={true} id={id} parent={this} />
                </div>
            )
        }
        if (type === 'field') {
            return <TextField id={id} parent={this} type={type} data={ObjOptions} configField={configField}/>
        }
        if (type === 'area') {
            return <TextField id={id} parent={this} type={type} data={ObjOptions} configField={configField}/>
        }

        if (type === 'file') {
            return <FileSelect data={ObjOptions} id={id} parent={this} type={type} />
        }
    };

    renderMutilCheckbox = (ObjOptions, id = '0') => {
        let values = [];
        if (ObjOptions.hasOwnProperty('multiple_value')) {
            values = ObjOptions.multiple_value;
        } else if (ObjOptions.hasOwnProperty('checkbox_value')) {
            values = ObjOptions.checkbox_value;
        }
        const html = values.map(item => {
            return (
                <div key={Identify.randomString(5)} className="option-row">
                    <Checkbox title={item.title} id={id} item={item} value={item.option_type_id} parent={this} />
                </div>
            )
        });
        return html;
    };

    updatePrices = (selected = this.selected) => {
        let exclT = 0;
        let inclT = 0;
        const customOptions = this.data.custom_options;
        const customSelected = selected;
        for (const c in customOptions) {
            const option = customOptions[c];
            for (const s in customSelected) {
                if (option.option_id === Number(s)) {
                    const selected = customSelected[s];
                    if (!selected) //when value is zero
                        continue

                    let values = '';
                    if (option.hasOwnProperty('field_value')) {
                        values = option.field_value;
                    } else if (option.hasOwnProperty('area_value')) {
                        values = option.area_value;
                    } else if (option.hasOwnProperty('checkbox_value')) {
                        values = option.checkbox_value;
                    } else if (option.hasOwnProperty('dropdown_value')) {
                        values = option.dropdown_value;
                    } else if (option.hasOwnProperty('multiple_value')) {
                        values = option.multiple_value;
                    } else if (option.hasOwnProperty('radio_value')) {
                        values = option.radio_value;
                    } else if (option.hasOwnProperty('date_value')) {
                        values = option.date_value;
                    } else if (option.hasOwnProperty('file_value')) {
                        values = option.file_value;
                    }

                    if (option.hasOwnProperty('date_value') || option.hasOwnProperty('area_value')
                        || option.hasOwnProperty('field_value') || option.hasOwnProperty('file_value')) {
                        const value = values.price;
                        exclT += value;
                        inclT += value;
                    } else {
                        for (const v in values) {
                            const value = values[v];
                            if (Array.isArray(selected)) {
                                if (selected.indexOf(value.option_type_id) !== -1) {
                                    exclT += value.price;
                                    inclT += value.price;
                                }
                            } else {
                                if (value.option_type_id === Number(selected)) {
                                    exclT += value.price;
                                    inclT += value.price;
                                }
                            }
                        }
                    }

                    // if (option.type === "date" || option.type === "time"
                    //     || option.type === "date_time" || option.type === "area"
                    //     || option.type === "field" || option.type === "file") {
                    //         const value = values[0];
                    //     if (value.price_excluding_tax) {
                    //         exclT += parseFloat(value.price_excluding_tax.price);
                    //         inclT += parseFloat(value.price_including_tax.price);
                    //     } else {
                    //         exclT += parseFloat(value.price);
                    //         inclT += parseFloat(value.price);
                    //     }
                    // } else {
                    //     for (const v in values) {
                    //         const value = values[v];
                    //         if (Array.isArray(selected)) {
                    //             if (selected.indexOf(value.id) !== -1) {
                    //                 //add price
                    //                 if (value.price_excluding_tax) {
                    //                     exclT += parseFloat(value.price_excluding_tax.price);
                    //                     inclT += parseFloat(value.price_including_tax.price);
                    //                 } else {
                    //                     exclT += parseFloat(value.price);
                    //                     inclT += parseFloat(value.price);
                    //                 }
                    //             }
                    //         } else {
                    //             if (value.id === selected) {
                    //                 //add price
                    //                 if (value.price_excluding_tax) {
                    //                     exclT += parseFloat(value.price_excluding_tax.price);
                    //                     inclT += parseFloat(value.price_including_tax.price);
                    //                 } else {
                    //                     exclT += parseFloat(value.price);
                    //                     inclT += parseFloat(value.price);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        }
        this.parentObj.Price.setCustomOptionPrice(exclT, inclT);
    }

    validateCustomizeOption = () => {
        const {app_options} = this.props
        const errors = {}
        if(app_options && app_options.custom_options) {
            app_options.custom_options.forEach((option) => {
                const optionId = option.option_id
                const configField = option.area_value || option.field_value || {}
                let error = ''
                if(option.required && (!this.selected[optionId] || !validateEmpty(this.selected[optionId]))) {
                    error = Identify.__("This is a required field.")
                } else if (configField.max_characters && Number(configField.max_characters) > 0 && this.selected[optionId].length > Number(configField.max_characters)) {
                    error = Identify.__(`Please enter no more than %s characters.`).replace('%s', Number(configField.max_characters))
                } else if (option.hasOwnProperty('date_value')) {
                    const selected = this.selected[optionId]
                    if(!selected.hasOwnProperty('date') && !selected.hasOwnProperty('time')) {
                        error = Identify.__('This is a required field.')
                    } else if (!selected.hasOwnProperty('date')) {
                        error = Identify.__('Missing date value.')
                    } else if (!selected.hasOwnProperty('time')) {
                        error = Identify.__('Missing time value.')
                    }
                }

                $(`#error-option-${optionId}`).text(error)
                if(error && error.trim() !== '') {
                    errors[optionId] = error;
                }
              
            })
        }

        return errors;
    }

    getParams = () => {
        const errors = this.validateCustomizeOption()
        if(Object.keys(errors).length > 0) {
            // this.setState({errors})
            return false
        }
        this.setParamOption('options');
        return this.params;
    }
    render() {
        return (
            <div>
                {this.renderOptions()}
            </div>
        )
    }
}
export default CustomOptions;
