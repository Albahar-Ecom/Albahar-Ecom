import React, { useState } from "react";
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import Identify from "src/simi/Helper/Identify";
import MUTATION_GRAPHQL from 'src/simi/queries/guestSubscribe.graphql'
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { useSubscribeEmail } from 'src/simi/talons/Subscribe/useSubscribeEmail';

require('./newsletter.scss')

const Newsletter = props => {
    const { toggleMessages } = props;

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
        console.log(isSuccess)
        toggleMessages([{ type: 'success', message: isSuccess, auto_dismiss: true }]);
        smoothScrollToView($("#id-message"));
    }

    const onChangeInput = (e) => {
        if ($(e.target).val()) {
            $(e.target).removeClass('in-valid');
            $(e.target).closest('#footer-newsletter-form').find('.message-error').addClass('hidden');
        }
    }

    const onSubmitForm = (e) => {
        e.preventDefault();
        const form = $("#footer-newsletter-form")
        const emailField = form.find('input[name="newsletter_email"]');
        form.find('.message-error').addClass('hidden');
        emailField.removeClass('in-valid');
        if (!emailField.val() || !emailField.val().trim()) {
            emailField.addClass('in-valid');
            form.find('.message-error').removeClass('hidden');
            return;
        } 
        const emailVal = emailField.val().trim();
        handleSubscribe({ email: emailVal });
    }

    return (
        <div className="footer-newsletter">
            <form id="footer-newsletter-form" method="POST" onSubmit={onSubmitForm}>
                <div className="newsletter-input-group">
                    <input type="email" name="newsletter_email" placeholder={Identify.__("Enter email")} onChange={onChangeInput}/>
                    <Whitebtn type="submit" disabled={isSubmitting} className="newsletter-button" text={Identify.__("Subscribe")}/>
                </div>
                <div className="message-error text-left hidden">{Identify.__('Invalid field')}</div>
            </form>
 
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages,
}

export default connect(
    null,
    mapDispatchToProps
)(Newsletter);
