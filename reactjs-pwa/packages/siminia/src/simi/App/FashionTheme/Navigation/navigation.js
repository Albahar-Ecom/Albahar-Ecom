import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import LeftMenuContent from './LeftMenuContent';
import { useNavigation } from 'src/simi/talons/Navigation/useNagivation';
import GET_CUSTOMER_QUERY from '@magento/venia-ui/lib/queries/getCustomer.graphql';

require('./navigation.scss');

const Navigation = props => {
    const { isOpen, isSignedIn } = useNavigation({ customerQuery: GET_CUSTOMER_QUERY });

    const className = `${Identify.isRtl() && 'nav_rtl'} left-menu-root ${isOpen ? 'open' : ''}`;

    return (
        <aside id="left-menu" className={className}>
            <LeftMenuContent
                isSignedIn={isSignedIn}
            />
        </aside>
    )
}

export default Navigation;
