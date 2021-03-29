import React from 'react';
// import Identify from 'src/simi/Helper/Identify';
// import Check from 'src/simi/BaseComponents/Icon/TapitaIcons/SingleSelect';
import { useStoreSwitcher } from 'src/simi/talons/Header/useStoreSwitcher';
import storeSwitcherOperations from './storeSwitcher.gql';
// import ListItemNested from 'src/simi/BaseComponents/MuiListItem/Nested';
// import MenuItem from 'src/simi/BaseComponents/MenuItem'
// import { configColor } from 'src/simi/Config';
import CountryFlag from 'src/simi/BaseComponents/CountryFlag'

const StoreSwitcher = props => {
    const {classes, storeviewLabel, opendefault, className} = props

    const talonProps = useStoreSwitcher({
        ...storeSwitcherOperations
    });

    const {
        handleSwitchStore,
        // currentStoreName,
        availableStores,
        // storeMenuRef,
        // storeMenuTriggerRef,
        // storeMenuIsOpen,
        // handleTriggerClick
    } = talonProps;

    if (!availableStores || availableStores.size <= 1) return null;

    const stores = [];

    availableStores.forEach((store, code) => {
        const isSelected = store.isCurrent
        const countryCode = code.split('_')
        stores.push(
            <div
                role="presentation"
                key={code}
                style={{ marginLeft: 5, marginRight: 5 }}
                onClick={() => handleSwitchStore(code)}
                className={`store-item-ctn ${isSelected && 'selected'}`}
            >
                <div className={`${classes["store-item"]} store-item ${isSelected && 'selected '+classes["selected"]}`}>
                    <div className={classes["storeview_ic"]}>
                        <CountryFlag alpha2={countryCode.pop()} />
                    </div>
                </div>
                <span>{store.storeName}</span>
            </div>
        );
    });

    return (
        <div
            className={className}
        >
            {stores}
        </div>
    )
};

export default StoreSwitcher;