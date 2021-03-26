import React, { Fragment, useState } from 'react';
import PageTitle from 'src/simi/App/FashionTheme/Customer/Account/Components/PageTitle';
import { SimiMutation } from 'src/simi/Network/Query';
import CUSTOMER_ADDRESS_UPDATE from 'src/simi/queries/customerAddressUpdate.graphql';
import CUSTOMER_ADDRESS_CREATE from 'src/simi/queries/customerAddressCreate.graphql';
import Identify from 'src/simi/Helper/Identify';
import TextBox from 'src/simi/BaseComponents/TextBox';
import { getAllowedCountries } from 'src/simi/Helper/Countries';
import RadioCheckbox from 'src/simi/App/FashionTheme/BaseComponents/RadioCheckbox';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

require('./style.scss');
const $ = window.$;

const renderRegionField = (selectedCountry, initialCountry, countries, addressData) => {
    const country_id = (selectedCountry !== -1) ? selectedCountry : initialCountry
    if (!country_id || !countries) return
    const country = countries.find(({ id }) => id === country_id);
    if (!country) return
    const { available_regions: regions } = country;
    const defaultRegion = addressData && addressData.region ? (addressData.region.hasOwnProperty('region_code') ? (addressData.region.region_code ? addressData.region.region_code : addressData.region.region) : addressData.region.region) : '';
    return (
        <div className={"form-group state-province"} id="state-province" key={Identify.randomString(3)}>
            <label className={`address-field-label ${(regions && Array.isArray(regions) && regions.length) ? 'address-field-has-dropdown' : ''}`}>{Identify.__("State/Province")} <span>*</span></label>
            {(regions && Array.isArray(regions) && regions.length) ?
                <select
                    defaultValue={addressData && addressData.region_code ? addressData.region_code : defaultRegion}
                    name="region_code" id='region_code'
                    className={'required'} >
                    <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                    {regions.map((region, index) => {
                        return <option key={index} value={region.code}>{region.name}</option>
                    })}
                </select> : <input type="text" id='region_code' name='region_code' className={`form-control required`} defaultValue={defaultRegion} />}
        </div>
    )
}

const NewAddress = (props) => {
    const { addresses, addressId, history, toggleMessages } = props;

    const backAddressList = () => {
        toggleMessages([{ type: 'error', message: Identify.__('This address book id is not exist!') }]);
        history.push('/addresses.html');
    }

    const { simiStoreConfig } = Identify.getStoreConfig();
    const storeConfig = simiStoreConfig && simiStoreConfig.config ? simiStoreConfig.config : {};
    const { address_fields_config } = storeConfig.customer ? storeConfig.customer : {};
    const countries = getAllowedCountries();

    let CUSTOMER_MUTATION = CUSTOMER_ADDRESS_CREATE;
    if (addressId) {
        CUSTOMER_MUTATION = CUSTOMER_ADDRESS_UPDATE;
    }

    let addressData = null;
    if (addressId) {
        if (history.location.state && history.location.state.hasOwnProperty('address') && history.location.state.address) {
            addressData = history.location.state.address;
        } else {
            backAddressList();
        }
    }
    /* if (addressId && addresses !== undefined) {
        if (!addresses || addresses && addresses.length < 1) {
            backAddressList();
        } else {
            const foundAddress = addresses.find((address) => address.id === Number(addressId));
            if (foundAddress) {
                addressData = foundAddress;
            } else {
                backAddressList();
            }
        }
    } */

    const initialCountry = addressData && addressData.country_id ? addressData.country_id : (address_fields_config && address_fields_config.country_id_default ? address_fields_config.country_id_default : '');

    const [selectedCountry, setSelectedCountry] = useState(-1);

    const handleOnChange = (e) => {
        if (e.target.value !== "" || e.target.value !== null) {
            $(e.target).removeClass("warning");
        }
    }

    const onHandleSelectCountry = () => {
        const country_id = $(`#address-form select[name=country_id]`).val();
        setSelectedCountry(country_id);
        setTimeout(() => {
            if ($(`#state-province`).find('input[name=region_code]').length) {
                $(`#state-province`).find('input[name=region_code]').val('');
            }
        }, 100);
    }

    const validPhone = (phone) => {
        return true;
        return /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phone);
    }

    const getRegionObject = (country_id, region_id) => {
        if (!country_id || country_id === -1)
            country_id = initialCountry
        let country;
        for (var i in countries) {
            if (countries[i].id === country_id) {
                country = countries[i];
                break;
            }
        }
        if (country && country.available_regions && country.available_regions.length) {
            for (var i in country.available_regions) {
                if (
                    country.available_regions[i].id === parseInt(region_id) ||
                    country.available_regions[i].code === region_id
                ) {
                    return country.available_regions[i];
                }
            }
        }
        return null
    }

    let loading = false;

    const handleSubmit = (e, mutationCallback) => {
        e.preventDefault();
        const submitValues = {};
        let formValid = true
        $(`#address-form input, #address-form select`).each(function () {
            const inputField = $(this)
            if (inputField) {
                const value = inputField.val().trim();
                const name = inputField.attr('name');
                if ((inputField.hasClass('required') || inputField.attr('required')) && !value) {
                    inputField.addClass('warning');
                    formValid = false;
                    smoothScrollToView($('#root'), 350, 50);
                    toggleMessages([{ type: 'error', message: Identify.__(`Required field is empty!`), auto_dismiss: true }]);
                    return false;
                }
                if (name === 'telephone' && !validPhone(value)) {
                    inputField.addClass('warning');
                    formValid = false;
                    smoothScrollToView($('#root'), 350, 50);
                    toggleMessages([{ type: 'error', message: Identify.__(`Invalid phone number!`), auto_dismiss: true }]);
                    return false;
                }
                inputField.removeClass('warning')
                if (name) {
                    if (name === 'street[0]') {
                        submitValues.street = [value]
                    } else if (name === 'street[1]' || (name === 'street[2]')) {
                        submitValues.street.push(value)
                    } else if (name === 'default_shipping' || (name === 'default_billing')) {
                        submitValues[name] = $(this).is(":checked")
                    } else if (name === 'region' || (name === 'region_code')) {
                        submitValues.region = {}
                        const region = getRegionObject(selectedCountry, value);
                        if (region) {
                            submitValues.region.region = region.name;
                            submitValues.region.region_id = region.id;
                            submitValues.region.region_code = region.code;
                        } else {
                            submitValues.region.region = value
                            submitValues.region.region_id = null;
                            submitValues.region.region_code = null;
                        }
                    } else {
                        submitValues[name] = value
                    }
                }
            }
        });
        if (!formValid)
            return;

        if (address_fields_config) {
            if (!submitValues.telephone) submitValues.telephone = address_fields_config.telephone_default || 'NA';
            if (!submitValues.street) submitValues.street = [address_fields_config.street_default || 'NA'];
            if (!submitValues.country_id) submitValues.country_id = address_fields_config.country_id_default || 'US';
            if (!submitValues.city) submitValues.city = address_fields_config.city_default || 'NA';
            if (!submitValues.postcode) submitValues.postcode = address_fields_config.zipcode_default || 'NA';
        }
        submitValues.id = addressData && addressData.id ? addressData.id : '';
        loading = true;
        if (loading) {
            showFogLoading();
        }
        mutationCallback({ variables: JSON.parse(JSON.stringify(submitValues)) });
    }

    return <div className={`address-book ${addressId ? 'page-edit-address' : 'page-new-address'}`}>
        <PageTitle title={addressId ? Identify.__("Edit Address") : Identify.__("Add New Address")} />
        <form id="address-form">
            <div className="address-form-container">
                <div className="contact-address-column">
                    <div className="address-label">{Identify.__('Contact Information')}</div>
                    <TextBox
                        defaultValue={addressData && addressData.firstname ? addressData.firstname : ''}
                        label={Identify.__("First name")}
                        placeholder={Identify.__("First name")}
                        name="firstname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    <TextBox
                        defaultValue={addressData && addressData.lastname ? addressData.lastname : ''}
                        label={Identify.__("Last name")}
                        placeholder={Identify.__("Last name")}
                        name="lastname"
                        className="required"
                        required={true}
                        onChange={handleOnChange}
                    />
                    {(!address_fields_config || (address_fields_config && address_fields_config.company_show !== '3')) &&
                        <TextBox
                            defaultValue={addressData && addressData.company ? addressData.company : ''}
                            label={Identify.__("Company")}
                            placeholder={Identify.__("Company")}
                            name="company"
                            className={address_fields_config && address_fields_config.company_show && address_fields_config.company_show === '1' ? 'required' : ''}
                            required={address_fields_config && address_fields_config.company_show && address_fields_config.company_show === '1' ? true : false}
                            onChange={handleOnChange}
                        />
                    }
                    {(!address_fields_config || (address_fields_config && address_fields_config.telephone_show !== '3')) &&
                        <TextBox
                            defaultValue={addressData && addressData.telephone ? addressData.telephone : ''}
                            label={Identify.__("Phone Number")}
                            placeholder={Identify.__("Phone Number")}
                            name="telephone"
                            className={(!address_fields_config || (address_fields_config && address_fields_config.telephone_show && address_fields_config.telephone_show === '1')) ? 'required' : ''}
                            required={(!address_fields_config || (address_fields_config && address_fields_config.telephone_show && address_fields_config.telephone_show === '1')) ? true : false}
                            onChange={handleOnChange}
                        />
                    }
                </div>
                <div className="information-address-column">
                    <div className="address-label">{Identify.__('Address')}</div>
                    {(!address_fields_config || (address_fields_config && address_fields_config.street_show !== '3')) &&
                        <Fragment>
                            <TextBox
                                defaultValue={addressData && addressData.street ? addressData.street[0] : ''}
                                label={Identify.__("Street Address")}
                                placeholder={Identify.__("Street Address")}
                                name="street[0]"
                                className={(!address_fields_config || (address_fields_config && address_fields_config.street_show && address_fields_config.street_show === '1')) ? 'required' : ''}
                                required={(!address_fields_config || (address_fields_config && address_fields_config.street_show && address_fields_config.street_show === '1')) ? true : false}
                                onChange={handleOnChange}
                            />
                            <TextBox
                                defaultValue={addressData && addressData.street ? addressData.street[1] : ''}
                                label={Identify.__("Street Address 2")}
                                placeholder={Identify.__("Street Address 2")}
                                name="street[1]"
                                onChange={handleOnChange}
                            />
                        </Fragment>
                    }
                    {(!address_fields_config || (address_fields_config && address_fields_config.city_show !== '3')) &&
                        <TextBox
                            defaultValue={addressData && addressData.city ? addressData.city : ''}
                            label={Identify.__("City")}
                            placeholder={Identify.__("City")}
                            name="city"
                            className={(!address_fields_config || (address_fields_config && address_fields_config.city_show && address_fields_config.city_show === '1')) ? 'required' : ''}
                            required={(!address_fields_config || (address_fields_config && address_fields_config.city_show && address_fields_config.city_show === '1')) ? true : false}
                            onChange={handleOnChange}
                        />
                    }
                    {(!address_fields_config || (address_fields_config && address_fields_config.zipcode_show !== '3')) &&
                        <TextBox
                            defaultValue={addressData && addressData.postcode ? addressData.postcode : ''}
                            label={Identify.__("Zip/Postal Code")}
                            placeholder={Identify.__("Zip/Postal Code")}
                            name="postcode"
                            className={(!address_fields_config || (address_fields_config && address_fields_config.zipcode_show && address_fields_config.zipcode_show === '1')) ? 'required' : ''}
                            required={(!address_fields_config || (address_fields_config && address_fields_config.zipcode_show && address_fields_config.zipcode_show === '1')) ? true : false}
                            onChange={handleOnChange}
                        />
                    }
                    <div className="form-group">
                        <label className={`address-field-label address-field-has-dropdown`}>{Identify.__("Country")} <span>*</span></label>
                        <select
                            name="country_id"
                            key={address_fields_config && address_fields_config.country_id_default || (addressData && addressData.country_id ? addressData.country_id : '')}
                            defaultValue={initialCountry}
                            onChange={() => onHandleSelectCountry()} onBlur={() => onHandleSelectCountry()}
                            className={'required'}
                            required={true}
                        >
                            <option key='pls-select' value="">{Identify.__('Please choose')}</option>
                            {
                                countries.map((country, index) => {
                                    return country.full_name_locale ? <option key={index} value={country.id}>{country.full_name_locale}</option> : ''
                                })
                            }
                        </select>
                    </div>
                    {renderRegionField(selectedCountry, initialCountry, countries, addressData)}
                    <div className="checkbox-bundle-to-default">
                        <RadioCheckbox defaultChecked={addressData && addressData.hasOwnProperty('default_billing') ? addressData.default_billing : false} title={Identify.__("Use as my default billing address")} id='checkbox-default-billing-address' name="default_billing" />
                        <RadioCheckbox defaultChecked={addressData && addressData.hasOwnProperty('default_shipping') ? addressData.default_shipping : false} title={Identify.__("Use as my default shipping address")} id='checkbox-default-shipping-address' name='default_shipping' />
                    </div>
                </div>
            </div>
            <SimiMutation mutation={CUSTOMER_MUTATION}>
                {(mutationCallback, { data, error }) => {
                    const { toggleMessages } = props;
                    if (error) {
                        hideFogLoading();
                        const graphqlError = error.message.replace('GraphQL error: ', '')
                        toggleMessages([{ type: 'error', message: Identify.__(`${graphqlError}`), auto_dismiss: true }]);
                    }
                    if (data) {
                        if (addressData && addressData.id) {
                            toggleMessages([{ type: 'success', message: Identify.__("Update address successful!"), auto_dismiss: true }]);
                        } else {
                            toggleMessages([{ type: 'success', message: Identify.__('Create new address successful!'), auto_dismiss: true }]);
                        }
                        hideFogLoading();
                        history.push('/addresses.html');
                    }
                    return (<Colorbtn
                        text={Identify.__("Save Address")}
                        className="save-address" onClick={(e) => handleSubmit(e, mutationCallback)} />);
                }}
            </SimiMutation>
        </form>
    </div>
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(NewAddress);
