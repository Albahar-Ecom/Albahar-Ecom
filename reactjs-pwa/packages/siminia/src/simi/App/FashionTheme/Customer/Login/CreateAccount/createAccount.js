import React from 'react';
import { shape, string } from 'prop-types';
import { Form } from 'informed';
import TextInputCustom from '../TextInputCustom'
import { validators } from './validators';
import Identify from 'src/simi/Helper/Identify'
import { createAccount } from 'src/simi/Model/Customer'
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { Redirect } from '@magento/venia-drivers';
import { useCreateAccount } from 'src/simi/talons/CreateAccount/useCreateAccount';
import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';

import CREATE_ACCOUNT_MUTATION from '@magento/venia-ui/lib/queries/createAccount.graphql';
import CREATE_CART_MUTATION from '@magento/venia-ui/lib/queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '@magento/venia-ui/lib/queries/getCartDetails.graphql';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';
import SIGN_IN_MUTATION from '@magento/venia-ui/lib/queries/signIn.graphql';
import { mergeCartsMutation } from '@magento/venia-ui/lib/queries/mergeCarts.gql';

require('./createAccount.scss')

const $ = window.$;

const CreateAccount = props => {
    const { history, classes, toggleMessages } = props;

    const createAccountPageProps = useCreateAccountPage();

    const talonProps = useCreateAccount({
        queries: {
            createAccountQuery: CREATE_ACCOUNT_MUTATION,
            customerQuery: GET_CUSTOMER_QUERY
        },
        mutations: {
            createCartMutation: CREATE_CART_MUTATION,
            getCartDetailsQuery: GET_CART_DETAILS_QUERY,
            signInMutation: SIGN_IN_MUTATION,
            mergeCartsMutation
        },
        initialValues: createAccountPageProps.initialValues,
        onSubmit: createAccountPageProps.handleCreateAccount
    });

    const {
        errors,
        handleSubmit,
        isDisabled,
        isSignedIn,
        initialValues
    } = talonProps;

    const errorMessage = errors.length
        ? errors
            .map(({ message }) => message)
            .reduce((acc, msg) => msg + '\n' + acc, '')
        : null;

    if (isSignedIn) {
        return <Redirect to="/" />;
    }

    if (errorMessage) {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
        toggleMessages([{ type: 'error', message: errorMessage, auto_dismiss: true }]);
    }

    return (
        <React.Fragment>
            <Form
                id="form-create-account"
                className={`create-acc-form ${classes.root} ${Identify.isRtl() ? classes['rtl-rootForm'] : null}`}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <div className="lead1">
                    {Identify.__('Personal Information')}
                </div>
                <div className="firstname">
                    <TextInputCustom
                        classes={classes}
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={validators.get('firstName')}
                        validateOnBlur
                        placeholder={Identify.__('First Name')}
                    />
                </div>
                <div className="lastname">
                    <TextInputCustom
                        classes={classes}
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={validators.get('lastName')}
                        validateOnBlur
                        placeholder={Identify.__('Last Name')}
                    />
                </div>
                <div className="lead2">
                    {Identify.__('Sign-in Information')}
                </div>
                <div className="email">
                    <TextInputCustom
                        classes={classes}
                        field="customer.email"
                        autoComplete="email"
                        validate={validators.get('email')}
                        validateOnBlur
                        placeholder={Identify.__('Email')}
                    />
                </div>
                <div className="password">
                    <TextInputCustom
                        classes={classes}
                        field="password"
                        type="password"
                        autoComplete="new-password"
                        validate={validators.get('password')}
                        validateOnBlur
                        placeholder={Identify.__('Password')}
                    />
                </div>
                <div className="confirm" >
                    <TextInputCustom
                        classes={classes}
                        field="confirm"
                        type="password"
                        validate={validators.get('confirm')}
                        validateOnBlur
                        placeholder={Identify.__('Confirm Password')}
                    />
                </div>
                <div className="action">
                    <button
                        priority="high" className="submitbtn" type="submit"
                        disabled={isDisabled}>
                        {Identify.__('Register')}
                    </button>
                </div>
            </Form>
        </React.Fragment>
    );
}

const mapDispatchToProps = {
    toggleMessages
};

CreateAccount.propTypes = {

    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    })
}

CreateAccount.defaultProps = {
    initialValues: {}
};

export default connect(null, mapDispatchToProps)(CreateAccount);
