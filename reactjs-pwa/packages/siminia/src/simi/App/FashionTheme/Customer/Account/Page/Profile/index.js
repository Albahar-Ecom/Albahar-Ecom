import React from 'react';
import { connect } from 'src/drivers';
import PageTitle from 'src/simi/App/core/Customer/Account/Components/PageTitle';
import ProfileForm from './ProfileForm';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
require('./style.scss');

const Profile = (props) => {
    return (
        <div className='account-information-area'>
            <PageTitle title={'Edit Account Information'} />
            <ProfileForm {...props} />
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(null, mapDispatchToProps)(Profile);


