import React, {useMemo} from 'react';
import { Form } from 'informed';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from 'src/util/formValidators';
import Identify from 'src/simi/Helper/Identify';
import { configColor } from 'src/simi/Config';
import FacebookIcon from 'src/simi/App/AlBahar/BaseComponents/Icon/Facebook2';
import GoogleIcon from 'src/simi/App/AlBahar/BaseComponents/Icon/Google';
import SocialButton from '../SocialButton';

require('./signIn.scss');

const SignIn = props => {

    const {onSocialLogin} = props

    const {simiStoreConfig} = Identify.getStoreConfig() || {};

    let facebookAppId = null
    if(simiStoreConfig.config && simiStoreConfig.config.facebook_config && simiStoreConfig.config.facebook_config.app_id) {
        facebookAppId = simiStoreConfig.config.facebook_config.app_id
    }
    let googleClientId = null
    if(simiStoreConfig.config && simiStoreConfig.config.google_config && simiStoreConfig.config.google_config.login_client_id) {
        googleClientId = simiStoreConfig.config.google_config.login_client_id
    }

    const handleForgotPassword = () => {
        props.onForgotPassword();
    };

    const onSignIn = (values) => {
        const email = values.email;
        const password = values.password;
        props.onSignIn({ email, password });
    }

    const showCreateAccountForm = () => {
        props.showCreateAccountForm();
    };

    const handleSocialLogin = (user) => {
        if (user && onSocialLogin) {
            const { _profile } = user;
            window.facebookUser = user
            onSocialLogin({ 
                email: _profile.email, 
                id: _profile.id, 
                lastName: _profile.lastName, 
                firstName: _profile.firstName 
            });
        }
    }

    const handleSocialLoginFailure = (err) => {
        console.error(err)
    }

    const socialLogin = useMemo(() => {
        if(!facebookAppId && !googleClientId) {
            return null
        }

        return (
            <div className="signInWithSocial">
                <div className="socialTitle"><span>{Identify.__('Or Login With')}</span></div>
                <ul className="socialList">
                    <li>
                        <SocialButton
                            provider='google'
                            appId={googleClientId}
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}>
                            <GoogleIcon style={{ width: 20, height: 20 }} />
                        </SocialButton>
                    </li>
                    <li>
                        <SocialButton
                            provider='facebook'
                            appId={facebookAppId}
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}>
                            <FacebookIcon style={{ width: 20, height: 20 }} fill={'#fff'} />
                        </SocialButton>
                    </li>
                </ul>
            </div>
        )
    })

    return (
        <div className='root sign-in-form'>
            <Form className='form' onSubmit={onSignIn} >
                <Field label={Identify.__("Email")} required={false} after={'*'} >
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field label={Identify.__("Password")} required={false} after={'*'} >
                    <TextInput
                        autoComplete="current-password"
                        field="password"
                        type="password"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <div className='signInButtonCtn'>
                    <button
                        priority="high" className='signInButton' type="submit"
                        style={{ backgroundColor: configColor.button_background, color: configColor.button_text_color }}>
                        {Identify.__('Sign In')}
                    </button>
                </div>
                <button
                    type="button"
                    className='forgotPassword'
                    onClick={handleForgotPassword}
                >
                    {Identify.__('Forgot password?')}
                </button>
            </Form>
            {socialLogin}
            <div className='signInDivider' />
            
            <div className='showCreateAccountButtonCtn'>
                <button priority="high" className='showCreateAccountButton' onClick={showCreateAccountForm} type="submit">
                    {Identify.__('Create an Account')}
                </button>
            </div>
        </div>
    );
}

export default SignIn;
