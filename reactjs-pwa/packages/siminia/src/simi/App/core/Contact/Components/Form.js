/* eslint-disable prefer-const */
import React, { Component } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { validateEmail } from 'src/simi/Helper/Validation';
// import {compose} from 'redux';
import classify from "src/classify";
import defaultClasses from "../style.css";
import {Colorbtn} from '../../../../BaseComponents/Button';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { sendContact } from '../../../../Model/Contact';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

const $ = window.$;
class Form extends Component {

    constructor(props) {
      super(props);
    }

    proceedData = (data)=>{
        smoothScrollToView($("#root"));
        if(data){
            hideFogLoading()
            if (data.errors && data.errors.length) {
                const errors = data.errors.map(error => {
                    return {
                        type: 'error',
                        message: error.message,
                        auto_dismiss: true
                    }
                });
                this.props.toggleMessages(errors)
            } else {
                $('#contact-form .form-control').val('');
                this.props.toggleMessages([{type: 'success', message: Identify.__('Thank you, we will contact you soon !'),auto_dismiss: true}])
            }
        }
    }

    validateForm = () => {
        let formCheck = true;
        $('#contact-form').find('.required').each(function () {
            if ($(this).val() === '' || $(this).val().length === 0) {
                formCheck = false;
                $(this).addClass('is-invalid')
                if($(this).find("is-invalid")){
                    $(this).css({border: '1px solid #fa0a11'})
                }
            } else {
                $(this).removeClass('is-invalid');
                if ($(this).attr('name') === 'email') {
                    if (!validateEmail($(this).val())) {
                        formCheck = false;
                        $(this).css({border: '1px solid #fa0a11'})
                        $(".invalid-email").show();
                    } else {
                        $(".invalid-email").hide();
                    }
                }
            }
        });

        if(!formCheck){
            smoothScrollToView($("#root"));
            this.props.toggleMessages([{type: 'error', message: Identify.__('Please check some required fields'),auto_dismiss: true}])
        }

        return formCheck;
    };

    onChange = (e) => {
        if(e.target.value !=='' || e.target.value !== null){
            $(e.target).removeClass('is-invalid');
            $(e.target).removeAttr('style')
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const isValidated = this.validateForm()
        const form = $('#contact-form').serializeArray();
        let value = {};
        if(isValidated){
            for(let i in form){
                let field = form[i];
                value[field.name] = field.value;
            }
            showFogLoading();
            sendContact(value,this.proceedData)
        }
        // console.log(value)
    }

    render() {
        const { classes } = this.props
        // console.log(data, 'log ')

        // const errorMessage = <small className="message" }>This field is required</small>
        const errorEmail = <small className="invalid-email" style={{display: 'none', color:"#fa0a11"}}>{Identify.__('Invalid email')}</small>

        return (
            <div className={classes['form-container']}>
                <form id="contact-form" onSubmit={this.handleSubmit}>
                    <h2>{Identify.__("Contact Us")}</h2>
                    <div className='form-group'>
                        <input type="text" onChange={this.onChange} className={`form-control ${classes['base-textField']} required`} name="name" placeholder="Name *" />
                    </div>
                    <div className='form-group'>
                        <input type="text" onChange={this.onChange} className={`form-control ${classes['base-textField']} required`} name="company" placeholder="Company Name *" />
                    </div>
                    <div className='form-group'>
                        <input type="text" onChange={this.onChange} className={`form-control ${classes['base-textField']} required`} name="email" placeholder="Email Address *" />
                        {errorEmail}
                    </div>
                    <div className='form-group'>
                        <input type="text" onChange={this.onChange} className={`form-control ${classes['base-textField']} required`} name="phone" placeholder="Telephone *" />
                    </div>
                    <div className="form-group fg-textarea">
                        <textarea onChange={this.onChange} className={`form-control ${classes['base-textareaField']} required`} name="message" cols="30" rows="5" placeholder="Enter your message here" ></textarea>
                    </div>
                    <div className={classes["contact-action-flex"]}>
                        <span className={classes["requirement"]}>{Identify.__('* Required fields')}</span>
                        <Colorbtn type="submit" className={classes['submit-btn']} text="Submit"/>
                    </div>
                    {/* <button></button> */}
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = {
    toggleMessages,
}

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
) (Form);

// export default classify(defaultClasses)(Form);
