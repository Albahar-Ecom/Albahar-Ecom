import React from 'react';
import { Link } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import Modal from 'src/simi/App/FashionTheme/BaseComponents/Modal';
import { Colorbtn } from 'src/simi/BaseComponents/Button';
import { configColor } from 'src/simi/Config';
import { useSignIn } from 'src/simi/talons/SignIn/useSignIn'

import SIGN_IN_MUTATION from '@magento/venia-ui/lib/queries/signIn.graphql';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import { GET_CART_DETAILS_QUERY } from 'src/simi/App/FashionTheme/Customer/Login/signIn.gql';
import { mergeCartsMutation } from 'src/simi/App/FashionTheme/Customer/Login/mergeCarts.gql';
import { validateEmail, validateEmpty } from 'src/simi/Helper/Validation';

const LoginModal = props => {

    const talonProps = useSignIn({
        createCartMutation: CREATE_CART_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        signInMutation: SIGN_IN_MUTATION,
        mergeCartsMutation
    });

    const {
        errors,
        handleSubmit
    } = talonProps;
    console.log(errors);

    const validateForm = (jQuery, form) => {
        let isAllow = true;
        const data = {};
        form.map((value, index) => {
            if (!validateEmpty(value.value)) {
                isAllow = false;
                jQuery.find(`input[name="${value.name}"]`).closest('.item-form-control').next('.mage-error').text('This is a required field.')
            } else if (value.name === 'email' && !validateEmail(value.value)) {
                isAllow = false;
                jQuery.find(`input[name="${value.name}"]`).closest('.item-form-control').next('.mage-error').text('Please enter a valid email address (Ex: johndoe@domain.com).')
            } else {
                jQuery.find(`input[name="${value.name}"]`).closest('.item-form-control').next('.mage-error').text('');
                data[value.name] = value.value;
            }
        });
        return { isAllow, data }
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        const form = $('#review-require-login-popup').find('form');
        const formData = form.serializeArray();
        const isValidated = validateForm(form, formData);
        if (isValidated.isAllow) {
            handleSubmit(isValidated.data);
        }
    }

    return <Modal id="review-require-login-popup">
        <div className="ck-popup-main">
            <div className="confirm-ck-col">
                <div className="confirm-ck-title">{Identify.__("Please sign in to SimiCart")}</div>
                <div className="confirm-ck-desc">{Identify.__("Lorem Ipsum is simply dummy text of the printing and typesetting industry.")}</div>

                <form className="form-ck-popup-signin" onSubmit={handleSignIn}>
                    <div className="form-control-pl">
                        <div className="item-form-control">
                            <span className="icon-user" />
                            <input type="email" placeholder={Identify.__("Email")} name="email" />
                        </div>
                        <div className="mage-error"></div>
                    </div>
                    <div className="form-control-pl">
                        <div className="item-form-control">
                            <span className="icon-lock" />
                            <input type="password" placeholder={Identify.__("Password")} name="password" />
                        </div>
                        <div className="mage-error"></div>
                    </div>
                    <Link className="popup-forgot-pw" to={{ pathname: '/login.html', state: { forgot: true } }}>{Identify.__("Forgot Password?")}</Link>
                    <Colorbtn type="submit" style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }} className="popup-signin-btn" text={Identify.__('Sign In')} />
                </form>
            </div>
        </div>
    </Modal>
}

export default LoginModal;
