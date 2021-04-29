import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import Identify from 'src/simi/Helper/Identify';

export const useAddressBook = props => {
    const {
        mutations: { setCustomerAddressOnCartMutation },
        queries: { getCustomerAddressesQuery, getCustomerCartAddressQuery },
        toggleActiveContent
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const addressCount = useRef();
    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const [
        setCustomerAddressOnCart,
        {
            error: setCustomerAddressOnCartError,
            loading: setCustomerAddressOnCartLoading
        }
    ] = useMutation(setCustomerAddressOnCartMutation);

    const {
        data: customerAddressesData,
        error: customerAddressesError,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery, { skip: !isSignedIn });

    const {
        data: customerCartAddressData,
        error: customerCartAddressError,
        loading: customerCartAddressLoading
    } = useQuery(getCustomerCartAddressQuery, { skip: !isSignedIn });

    useEffect(() => {
        if (customerAddressesError) {
            console.error(customerAddressesError);
        }

        if (customerCartAddressError) {
            console.error(customerCartAddressError);
        }
    }, [customerAddressesError, customerCartAddressError]);

    const derivedErrorMessage = useMemo(() => {
        let errorMessage;

        if (setCustomerAddressOnCartError) {
            const { graphQLErrors, message } = setCustomerAddressOnCartError;
            errorMessage = graphQLErrors
                ? graphQLErrors.map(({ message }) => message).join(', ')
                : message;
        }

        return errorMessage;
    }, [setCustomerAddressOnCartError]);

    const isLoading =
        customerAddressesLoading ||
        customerCartAddressLoading ||
        setCustomerAddressOnCartLoading;

    const customerAddresses =
        (customerAddressesData && customerAddressesData.customer.addresses) ||
        [];

    useEffect(() => {
        if (customerAddresses.length !== addressCount.current) {
            // Auto-select newly added address when count changes
            if (addressCount.current) {
                const newestAddress =
                    customerAddresses[customerAddresses.length - 1];
                setSelectedAddress(newestAddress.id);
            }

            addressCount.current = customerAddresses.length;
        }
    }, [customerAddresses]);

    const handleEditAddress = useCallback(
        address => {
            setActiveAddress(address);
            toggleDrawer('shippingInformation.edit');
        },
        [toggleDrawer]
    );

    const handleAddAddress = useCallback(() => {
        const { simiStoreConfig, countries } = Identify.getStoreConfig() || {}
        const { config } = simiStoreConfig || {}
        const { base, customer } = config || {}
        const { country_code } = base || {}
        let defaultAddressData = {
            region: {
                code: ''
            }
        };
        // Fix bug add default address data from config
        // check if country_code available in countries (fix for case 1 country in the available country list)
        const available = countries && countries.find((c)=>c.id === country_code);
        if (available) {
            defaultAddressData.country = {
                code: country_code
            };
        } else if(countries && countries.length) {
            defaultAddressData.country = {
                code: countries[0].id || ''
            };
        } else {
            defaultAddressData.country = {
                code: ''
            };
        }
        // Add default address field data from simiconnector config
        const {address_fields_config} = customer || {}
        const {
            enable,
            company_show,
            street_default,
            street_show,
            city_default,
            city_show,
            zipcode_default,
            zipcode_show,
            telephone_default,
            telephone_show,
    
            // country_id_default, // native only
            // country_id_show,
            // dob_show, // native only
            // fax_show,
            // gender_show,
            // prefix_show,
            // region_id_default, // native only
            // region_id_show,
            // suffix_show,
            // taxvat_show,
        } = address_fields_config || {}
        if (enable) {
            defaultAddressData = {
                ...defaultAddressData,
                street: street_show !== '1' ? [street_default]: [],
                city: city_show !== '1' ? city_default: '',
                postcode: zipcode_show !== '1' ? zipcode_default: '',
                telephone: telephone_show !== '1' ? telephone_default: '',
            }
        }

        handleEditAddress(defaultAddressData);
    }, [handleEditAddress]);

    const handleSelectAddress = useCallback(addressId => {
        setSelectedAddress(addressId);
    }, []);

    // GraphQL doesn't return which customer address is selected, so perform
    // a simple search to initialize this selected address value.
    if (
        customerAddresses.length &&
        customerCartAddressData &&
        !selectedAddress
    ) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] ===
                        primaryCartAddress.street[0] &&
                    customerAddress.firstname ===
                        primaryCartAddress.firstname &&
                    customerAddress.lastname === primaryCartAddress.lastname
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
            }
        }
    }

    const handleApplyAddress = useCallback(async () => {
        try {
            await setCustomerAddressOnCart({
                variables: {
                    cartId,
                    addressId: selectedAddress
                }
            });
        } catch {
            return;
        }

        toggleActiveContent();
    }, [
        cartId,
        selectedAddress,
        setCustomerAddressOnCart,
        toggleActiveContent
    ]);

    const handleCancel = useCallback(() => {
        setSelectedAddress();
        toggleActiveContent();
    }, [toggleActiveContent]);

    return {
        activeAddress,
        customerAddresses,
        errorMessage: derivedErrorMessage,
        isLoading,
        handleAddAddress,
        handleApplyAddress,
        handleCancel,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress
    };
};
