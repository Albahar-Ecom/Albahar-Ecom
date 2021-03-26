import React, { useState, useEffect } from 'react';
import Identify from 'src/simi/Helper/Identify';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import TitleHelper from 'src/simi/Helper/TitleHelper'
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useSignIn } from 'src/simi/talons/SignIn/useSignIn'

import SIGN_IN_MUTATION from '@magento/venia-ui/lib/queries/signIn.graphql';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import { mergeCartsMutation } from './mergeCarts.gql';

const Login = props => {
    const [tabOpen, setTabOpen] = useState(1);      // 1: login page, 2: register, 3: forgot pass

    const {
        classes,
        isSignedIn,
        firstname,
        history,
        toggleMessages
    } = props;

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

    const stateForgot = () => {
        const { history } = props;

        return history.location && history.location.state && history.location.state.forgot;
    }

    useEffect(() => {
        if (stateForgot()) {
            showForgotPasswordForm()
        }
    }, []);

    const emailLoginForm = () => {
        const className = tabOpen == 1 ? classes.signIn_open : classes.signIn_closed;

        return (
            <div className={className}>
                <SignIn
                    classes={classes}
                    onForgotPassword={showForgotPasswordForm}
                    onSignIn={handleSubmit}
                />
            </div>
        );
    }

    const createAccount = (className) => {
        return (
            <div className={className}>
                <CreateAccount
                    onSignIn={handleSubmit}
                    history={history}
                    classes={classes}
                />
            </div>
        );
    };



    const forgotPassword = (className) => {
        return (
            <div className={className}>
                <ForgotPassword
                    onCancel={hideForgotPasswordForm}
                    history={history}
                />
            </div>
        );
    }


    const hideForgotPasswordForm = () => { };

    const createAccountForm = () => {
        const className = tabOpen == 2 ? classes.form_open : classes.form_closed;

        return createAccount(className);
    }

    const forgotPasswordForm = () => {
        const className = tabOpen == 3 ? classes.form_open : classes.form_closed;
        return forgotPassword(className);
    }

    const showForgotPasswordForm = () => {
        setTabOpen(3);
    };

    const handleGoBack = () => {
        if (history) history.push('/login.html');
    };

    if (isSignedIn) {
        if (history.location.hasOwnProperty('pushTo') && history.location.pushTo) {
            const { pushTo } = history.location;
            history.push(pushTo);
        } else {
            history.push('/');
        }
        smoothScrollToView($('#root'));
        const message = firstname
            ? Identify.__('Welcome %s Start shopping now').replace('%s', firstname)
            : Identify.__('You have successfully logged in, Start shopping now');
        if (toggleMessages)
            toggleMessages([{ type: 'success', message: message, auto_dismiss: true }]);
    }

    if (errors) {
        const messages = errors.map(value => {
            return { type: 'error', message: value.message, auto_dismiss: true }
        })
        toggleMessages(messages);
    }

    const renderTitle = () => {
        let html = '';
        switch (tabOpen) {
            case 2:
                html = Identify.__('Create Account');
                break;
            case 3:
                html = Identify.__('Forgot Password');
                break;
            default:
                html = Identify.__('Sign In');
                break;
        }

        return TitleHelper.renderMetaHeader({ title: html })
    }


    return (
        <React.Fragment>
            {renderTitle()}
            <div id="login-background" className={classes['login-background']}>
                {tabOpen == '3' &&
                    <div className={`container ${classes['back-container']}`} id="back-container">
                        <button className={`special-back ${classes['login-back']}`} id="btn-back"
                            onClick={handleGoBack} >
                            <span>{Identify.__('back').toUpperCase()}</span>
                        </button>
                    </div>}
                <div className={`container ${classes['login-container']}`}>
                    <div className={`${tabOpen === 3 ? classes['inactive'] : ''} ${classes['select-type']}`}>
                        <button
                            onClick={() => setTabOpen(1)}
                            className={`${tabOpen === 1 ? classes['active'] : ''} ${classes['signin-type']}`}
                        >
                            <div className={`${classes['wrap']} ${Identify.isRtl() ? classes['rtl-wrap'] : ''}`}>
                                <span className={classes['title-signin']}>{Identify.__('Sign In')}</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setTabOpen(2)}
                            className={`${tabOpen === 2 ? classes['active'] : ''} ${classes['register-type']}`}
                        >
                            <div className={`${classes['wrap']} ${Identify.isRtl() ? classes['rtl-wrap'] : ''}`}>
                                <span className={classes['title-register']}>{Identify.__('Register')}</span>
                            </div>
                        </button>
                    </div>
                    {emailLoginForm()}
                    {createAccountForm()}
                    {forgotPasswordForm()}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Login;
