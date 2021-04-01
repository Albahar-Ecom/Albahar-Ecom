import React from 'react';
import SocialLogin from 'react-social-login';

class SocialButton extends React.Component {
    render() {
        return (
            <span style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }} onClick={this.props.triggerLogin} {...this.props}>
                { this.props.children}
            </span>
        );
    }
}

export default SocialLogin(SocialButton);