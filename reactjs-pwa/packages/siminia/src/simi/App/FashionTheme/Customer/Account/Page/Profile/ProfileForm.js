import React from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { validators } from './validators';
import Identify from 'src/simi/Helper/Identify';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import RadioCheckbox from 'src/simi/App/FashionTheme/BaseComponents/RadioCheckbox';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useProfile } from 'src/simi/talons/Profile/useProfile';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import inputClasses from './input.css';

import CUSTOMER_UPDATE from 'src/simi/queries/customerUpdate.graphql';
import CUSTOMER_PASSWORD_UPDATE from 'src/simi/queries/customerPasswordUpdate.graphql';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';

require('./style.scss');

const $ = window.$;
const ProfileForm = props => {
    const { history, toggleMessages } = props;
    let defaultForm = false;
    if (
        history.location.state
        && history.location.state.hasOwnProperty('profile_edit')
        && history.location.state.profile_edit
    ) {
        defaultForm = history.location.state.profile_edit;
    }

    const onSubmit = () => {
        smoothScrollToView($('#root'));
        toggleMessages([{ type: 'success', message: Identify.__('You saved the account information.'), auto_dismiss: true }])
    }

    const talonProps = useProfile({
        defaultForm,
        updateCustomerMutation: CUSTOMER_UPDATE,
        updateCustomerPasswordMutation: CUSTOMER_PASSWORD_UPDATE,
        customerQuery: GET_CUSTOMER_QUERY,
        onSubmit: onSubmit
    });

    const {
        isSignedIn,
        initialValues,
        handleUpdateInfo,
        errors,
        isActiveForm,
        handleActiveForm,
        isLoading
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (errors) {
        toggleMessages([{ type: 'error', message: errors, auto_dismiss: true }]);
    }

    const handleOnChange = (e) => {
        let str = checkPassStrength(e.target.value);
        $('#strength-value').html(Identify.__(str))
    }

    const scorePassword = pass => {
        let score = 0;
        if (!pass)
            return score;

        // award every unique letter until 5 repetitions
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            if (i <= 8) {
                letters[pass[i]] = (letters[pass[i]] || 0) + 1;
                score += 5.0 / letters[pass[i]];
            }
        }

        // bonus points for mixing it up
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        }

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return parseInt(score, 10);
    }

    const checkPassStrength = pass => {
        let score = scorePassword(pass);
        switch (true) {
            case score > 70:
                return Identify.__("Strong");
            case score > 50:
                return Identify.__("Good");
            case (score >= 30):
                return Identify.__("Weak");
            default:
                return Identify.__("no password");
        }
    }

    const renderAlternativeForm = () => {
        switch (isActiveForm) {
            case 'email':
                return (
                    <React.Fragment>
                        <h4 className='title'>{Identify.__("Change Email")}</h4>
                        <Field
                            classes={inputClasses}
                            label={Identify.__('Email') + '*'}
                            required={true}>
                            <TextInput
                                placeholder={Identify.__("Email")}
                                field="email"
                                type="email"
                                autoComplete="email"
                                validate={validators.get('email')}
                                validateOnBlur
                            />
                        </Field>
                        <Field
                            classes={inputClasses}
                            label={Identify.__('Current password') + '*'}
                            required={true}>
                            <TextInput
                                placeholder={Identify.__("Current Password")}
                                field="password"
                                type="password"
                                validate={validators.get('oldPass')}
                                validateOnBlur
                            />
                        </Field>
                    </React.Fragment>
                );
            case 'password':
                return (
                    <React.Fragment>
                        <h4 className="title">{Identify.__("Change Password")}</h4>
                        <Field
                            classes={inputClasses}
                            label={Identify.__('Current password') + '*'}
                            required={true}>
                            <TextInput
                                placeholder={Identify.__("Current Password")}
                                field="current_password"
                                type="password"
                                validate={validators.get('oldPass')}
                                validateOnBlur
                            />
                        </Field>
                        <Field
                            classes={inputClasses}
                            label={Identify.__('New password') + '*'}
                            required={true}>
                            <TextInput
                                placeholder={Identify.__("New password")}
                                field="new_password"
                                type="password"
                                validate={validators.get('newPassword')}
                                validateOnBlur
                                onChange={e => handleOnChange(e)}
                            />
                        </Field>
                        <div className="password-strength"><span>{Identify.__('Password strength:')}</span><span id="strength-value" style={{ marginLeft: 3 }}>{Identify.__('no password')}</span></div>
                        <Field
                            classes={inputClasses}
                            label={Identify.__('Confirm new password') + '*'}
                            required={true}>
                            <TextInput
                                placeholder={Identify.__("Confirm new password")}
                                field="confirm_password"
                                type="password"
                                validate={validators.get('confirmNewPass')}
                                validateOnBlur
                            />
                        </Field>
                    </React.Fragment>
                )
        }
    }

    return (
        <React.Fragment>
            <Form
                id="form-edit-profile"
                initialValues={initialValues}
                onSubmit={handleUpdateInfo}>
                <div className='row-edit-profile'>
                    <div className="main__edit-column">
                        <h4 className="title">
                            {Identify.__("Account information")}
                        </h4>
                        <div className="firstname">
                            <Field label={Identify.__('First Name') + '*'} required={true} classes={inputClasses}>
                                <TextInput
                                    classes={inputClasses}
                                    placeholder={Identify.__("First name")}
                                    autoComplete="given-name"
                                    field="firstname"
                                    validate={validators.get('firstName')}
                                    validateOnBlur
                                />
                            </Field>
                        </div>
                        <div className="lastname">
                            <Field label={Identify.__('Last Name') + '*'} required={true} classes={inputClasses}>
                                <TextInput
                                    placeholder={Identify.__("Last name")}
                                    autoComplete="family-name"
                                    field="lastname"
                                    validate={validators.get('lastname')}
                                    validateOnBlur
                                />
                            </Field>
                        </div>
                        <RadioCheckbox key={Identify.randomString(2)} className="first" defaultChecked={isActiveForm === 'email' ? true : false} title={Identify.__("Change email")} id='checkbox-change-email' onClick={() => handleActiveForm(isActiveForm === 'email' ? false : 'email')} />
                        <RadioCheckbox key={Identify.randomString(2)} defaultChecked={isActiveForm === 'password' ? true : false} title={Identify.__("Change password")} id='checkbox-change-password' onClick={() => handleActiveForm(isActiveForm === 'password' ? false : 'password')} />
                    </div>
                    <div className='alternative__edit-column'>
                        {renderAlternativeForm()}
                    </div>
                </div>
                <Colorbtn
                    text={Identify.__("Save")}
                    className="save-profile"
                    type="submit"
                    disabled={isLoading}
                />
            </Form>
        </React.Fragment>
    );
}

export default ProfileForm;
