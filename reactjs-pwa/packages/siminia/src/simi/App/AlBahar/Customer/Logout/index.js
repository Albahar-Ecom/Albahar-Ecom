import React, { useEffect } from 'react';

import { useMyAccount } from 'src/simi/talons/MyAccount/useMyAccount';
import SIGN_OUT_MUTATION from '@magento/venia-ui/lib/queries/signOut.graphql';

const Logout = props => {
    const { history } = props;

    const {
        handleSignOut,
        isSignedIn
    } = useMyAccount({
        signOutMutation: SIGN_OUT_MUTATION
    });

    useEffect(() => {
        if (isSignedIn) {
            handleSignOut();
        } else {
            history.push('/');
        }
    }, [isSignedIn, handleSignOut]);

    return null;
}

export default Logout;
