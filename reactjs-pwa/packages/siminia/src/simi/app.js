import React, { Fragment, useMemo, useCallback } from 'react';
import Main from './App/AlBahar/Main';
import Navigation from './App/AlBahar/Navigation';
import AppRouter from './Router/AlBahar/AppRouter'
import Mask from 'src/simi/BaseComponents/Mask';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { useToasts } from '@magento/peregrine';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import Icon from '@magento/venia-ui/lib/components/Icon';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon
} from 'react-feather';
import Identify from './Helper/Identify';
import HOProgress from './ProgressBar/HOProgress';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const ERROR_MESSAGE = Identify.__('Sorry! An unexpected error occurred.');

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const [, { addToast }] = useToasts();
    const storeConfig = Identify.getStoreConfig();
    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: 'You are offline. Some features may be unavailable.',
            timeout: 3000
        });
    }, [addToast]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: 'You are online.',
            timeout: 3000
        });
    }, [addToast]);

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: 15000,
                type: 'error'
            };

            addToast(errorToastProps);
        },
        [addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    try {
        const splashScreen = document.getElementById('splash-screen')
        if (splashScreen)
            splashScreen.style.display = 'none';
    } catch (err) {
        console.warn('no splash screen found')
    }

    return (
        <Fragment>
            <HOProgress />
            {useMemo(() =>
                <Main>
                    <AppRouter />
                </Main>, [])}
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} />
            {useMemo(() => storeConfig ? <Navigation /> : '', [storeConfig])}
            <ToastContainer />
        </Fragment>
    );
}

export default App;
