import React from 'react';
import { shape, string } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';

require('./style.scss');
const $ = window.$;

const FormSubmissionSuccessful = props => {
    const { email, history } = props;
    const textMessage = Identify.__('If there is an account associated with %s you will receive an email with a link to change your password.').replace('%s', email);

    const removeClass = () => {
        $('#back-container').addClass('hidden');
        $('#login-background').addClass('restyle');
    }

    return (
        <div className='forgot-password-page-success'>
            <p className='fpass-success-text'>{textMessage}</p>
            <div className='buttonContainer'>
                <div role="presentation" onClick={() => history.push('/')} className={'submitButton'}>
                    <span className={'text-continue'}>{Identify.__('Continue Shopping')}</span>
                </div>
            </div>
            {removeClass()}
        </div>
    );
};

export default FormSubmissionSuccessful;

FormSubmissionSuccessful.propTypes = {
    classes: shape({
        root: string,
        text: string
    }),
    email: string
};
