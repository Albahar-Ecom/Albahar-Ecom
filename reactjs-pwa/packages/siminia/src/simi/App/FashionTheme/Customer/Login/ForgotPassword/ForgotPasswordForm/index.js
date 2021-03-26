import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import { isRequired } from 'src/util/formValidators';
import Identify from 'src/simi/Helper/Identify';
import TextInputCustom from '../../TextInputCustom';
require('./forgot.scss');

const ForgotPasswordForm = props => {
    const { isResettingPassword, onSubmit } = props;

    return (
        <Form className={`forgot-form`} onSubmit={onSubmit}>
            <div className="forgot-area">
                <TextInputCustom
                    icon_class={"icon-user"}
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    validateOnBlur
                    placeholder={Identify.__('Email')}
                />
            </div>
            <div className='forgot-submit-area'>
                <button priority="high" className='submitButton' type="submit" disabled={isResettingPassword}>
                    {Identify.__('Submit')}
                </button>
            </div>
        </Form>
    )
}

ForgotPasswordForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default ForgotPasswordForm;
