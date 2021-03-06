import React, { Fragment, /* useEffect, */ useCallback } from 'react';
import { connect } from 'src/drivers';
import { Redirect } from '@magento/venia-drivers';
import Identify from 'src/simi/Helper/Identify';
import Loading from "src/simi/BaseComponents/Loading";
import { useToasts } from '@magento/peregrine';
import CUSTOMER_ADDRESS from 'src/simi/queries/customerAddress';
import CUSTOMER_ADDRESS_DELETE from 'src/simi/queries/customerAddressDelete';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import PageTitle from 'src/simi/App/FashionTheme/Customer/Account/Components/PageTitle';
import AddressItem from '../../Components/AddressItem';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { Link } from 'src/drivers';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
// import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useAddressBook } from 'src/simi/talons/AddressBook/useAddressBook';

require('./style.scss');

const AddressBook = (props) => {
    const { history, user } = props;

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        hideFogLoading();
        addToast({
            type: 'info',
            message: Identify.__('Delete address book successful!'),
            timeout: 5000
        });
    }, [addToast]);

    const talonProps = useAddressBook({
        afterSubmit,
        query: { getCustomerAddress: CUSTOMER_ADDRESS },
        mutation: { deleteAddressMutation: CUSTOMER_ADDRESS_DELETE }
    });

    const { initialValues, loading, formErrors, handleDeleteItem, isSignedIn } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (loading && !initialValues) {
        return <Loading />
    }

    if (formErrors) {
        toggleMessages([{ type: 'error', message: formErrors, auto_dismiss: true }])
    }

    const { addresses } = initialValues;

    const handleNewAddress = (addId) => {
        if (addId) {
            const addressFounded = addresses.find(({ id }) => id === Number(addId));
            if (addressFounded) {
                const location = {
                    pathname: `/new-address.html/${addId}`,
                    state: {
                        address: addressFounded
                    }
                };
                history.push(location);
            } else {
                history.push('/new-address.html');
            }
        } else {
            history.push('/new-address.html');
        }
    }

    /* useEffect(() => {
        smoothScrollToView($('#root'));
    }, []); */

    const deleteAddress = (id) => {
        if (confirm(Identify.__("Are you sure delete address?"))) {
            showFogLoading();
            handleDeleteItem(id);
        }
    }

    const renderDefaultAddress = (addresses) => {

        const defaultShipping = addresses.find(({ default_shipping }) => default_shipping === true);
        const defaultBilling = addresses.find(({ default_billing }) => default_billing === true);

        if (!defaultBilling && !defaultShipping) {
            return <div>{Identify.__("No default billing/shipping address selected.")}</div>
        }

        return (
            <div className="address-content">
                {defaultBilling && <div className="address-box-col billing-address">
                    <div className="box-item-address">
                        <div className='box-title'>
                            {Identify.__('Default Billing Address')}
                        </div>
                        <AddressItem addressData={defaultBilling} customer_email={user && user.email ? user.email : ''} />
                    </div>
                    <div onClick={() => handleNewAddress(defaultBilling.id)} className="edit-address-item"><span className="icon-pencil" title={Identify.__("Edit")} /></div>
                </div>}
                {defaultShipping && <div className="address-box-col shipping-address">
                    <div className="box-item-address">
                        <div className='box-title'>
                            {Identify.__('Default Shipping Address')}
                        </div>
                        <AddressItem addressData={defaultShipping} customer_email={user && user.email ? user.email : ''} />
                    </div>
                    <div onClick={() => handleNewAddress(defaultShipping.id)} className="edit-address-item"><span className="icon-pencil" title={Identify.__("Edit")} /></div>
                </div>}
            </div>
        )
    }

    const renderAdditionalItem = (addressList) => {
        let html = null;
        if (addressList.length) {
            html = addressList.filter(({ default_shipping, default_billing }) => default_shipping === false || default_billing === false || (default_shipping === false && default_billing === false)).map((address, idx) => {
                return <div className="address-box-col" key={idx} data-id={address.id}>
                    <div className="box-item-address">
                        <AddressItem addressData={address} customer_email={user && user.email ? user.email : ''} />
                    </div>
                    <div className="additional-item-actions">
                        <div onClick={() => handleNewAddress(address.id)} className="edit-address-item"><span className="icon-pencil" title={Identify.__("Edit")} /></div>
                        <div onClick={() => deleteAddress(address.id)} className="del-address-item"><span className="icon-trash" title={Identify.__("Delete")} /></div>
                    </div>
                </div>
            });
        }
        return html;
    }

    const children = <Fragment>
        <div className='default-address'>
            <div className="address-label">{Identify.__("Default Addresses")}</div>
            {addresses && addresses.length ? renderDefaultAddress(addresses) : null}
        </div>
        <div className="additional-address">
            <div className="address-label">{Identify.__("Additional Address Entries")}</div>
            {addresses && addresses.length ? <div className="additional-address-contain">
                {renderAdditionalItem(addresses)}
            </div> : null}
        </div>
        <Whitebtn onClick={() => handleNewAddress()} text={Identify.__('Add New Address')} className='add-new-address' />
    </Fragment>


    return <div className="address-book">
        <PageTitle title={Identify.__("Address Book")} />
        {children}
    </div>

}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(AddressBook);
