import LoginPage from './loginPage';
import { connect, withRouter } from 'src/drivers';
import { compose } from 'redux';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import defaultClasses from './login.css';
import classify from 'src/classify';

const mapStateToProps = ({ user }) => {
    const { currentUser, isSignedIn, forgotPassword } = user;
    const { firstname, email, lastname } = currentUser;

    return {
        email,
        firstname,
        forgotPassword,
        isSignedIn,
        lastname,
    };
};

const mapDispatchToProps = {
    toggleMessages
};

export default compose(
    classify(defaultClasses),
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(LoginPage);
