import React from 'react';
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
            console.log(_profile)
            onSocialLogin({ email: _profile.email, id: _profile.id });
        }
    }

    const handleSocialLoginFailure = (err) => {
        console.error(err)
    }

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
            <div className="signInWithSocial">
                <div className="socialTitle"><span>{Identify.__('Or Login With')}</span></div>
                <ul className="socialList">
                    <li>
                        <SocialButton
                            provider='google'
                            appId='788184555937-b6u723gprqal06e0rshmet8sjh4de11s.apps.googleusercontent.com'
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}>
                            <GoogleIcon style={{ width: 20, height: 20 }} />
                        </SocialButton>
                    </li>
                    <li>
                        <SocialButton
                            provider='facebook'
                            appId='442617646953904'
                            onLoginSuccess={handleSocialLogin}
                            onLoginFailure={handleSocialLoginFailure}>
                            <FacebookIcon style={{ width: 20, height: 20 }} fill={'#fff'} />
                        </SocialButton>
                    </li>
                </ul>
            </div>
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
