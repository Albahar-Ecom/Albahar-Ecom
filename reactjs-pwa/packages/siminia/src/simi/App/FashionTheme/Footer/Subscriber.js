import React from 'react';
import Identify from "src/simi/Helper/Identify";
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import MUTATION_GRAPHQL from 'src/simi/queries/guestSubscribe.graphql'
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { useSubscribeEmail } from 'src/simi/talons/Subscribe/useSubscribeEmail';

const Subscriber = props => {
    const { toggleMessages, className } = props;

    const talonProps = useSubscribeEmail({
        query: { subscribeMutation: MUTATION_GRAPHQL }
    });

    const {
        subscribeError,
        isSubmitting,
        isSuccess,
        handleSubscribe
    } = talonProps;

    if (subscribeError) {
        toggleMessages([{ type: 'error', message: subscribeError, auto_dismiss: true }]);
        smoothScrollToView($("#id-message"));
    }

    if (isSuccess) {
        toggleMessages([{ type: 'success', message: isSuccess, auto_dismiss: true }]);
        smoothScrollToView($("#id-message"));
    }

    const onChangeInput = (e) => {
        if ($(e.target).val()) {
            $(e.target).removeClass('in-valid');
            $(e.target).closest('.subscriber-form').find('.message-error').removeClass('hidden');
        }
    }

    const onSubmitForm = (e) => {
        e.preventDefault();
        const emailField = $("#subscribe-form-footer").find('input[name="email"]');
        if (!emailField.val() || !emailField.val().trim()) {
            emailField.addClass('in-valid');
            $("#subscribe-form-footer").find('.message-error').addClass('hidden');
            return;
        }
        const emailVal = emailField.val().trim();
        handleSubscribe({ email: emailVal });
    }

    return (<div className={`${className} subscriber-form`}>
        <form id='subscribe-form-footer' className={`${className} subscriber-form`} onSubmit={onSubmitForm}>
            <input name="email" type='email' placeholder={Identify.__('Enter your email ')} onChange={onChangeInput} />
            <button type="submit" disabled={isSubmitting}>{Identify.__('SUBSCRIBE')}</button>
        </form>
        <div className="message-error text-left hidden">{Identify.__('Invalid field')}</div>
    </div>);
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(
    null,
    mapDispatchToProps
)(Subscriber);
