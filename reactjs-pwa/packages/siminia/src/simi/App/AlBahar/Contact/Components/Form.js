/* eslint-disable prefer-const */
import React, { Component, useEffect } from 'react';
import Identify from 'src/simi/Helper/Identify';
import { validateEmail } from 'src/simi/Helper/Validation';
// import {compose} from 'redux';
import classify from "src/classify";
import defaultClasses from "../style.css";
import {Colorbtn} from '../../../../BaseComponents/Button';
import {showFogLoading, hideFogLoading} from 'src/simi/BaseComponents/Loading/GlobalLoading'
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import { compose } from 'redux';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

// import { sendContact } from '../../../../Model/Contact';
import { useContact } from '../../talons/Contact/useContact';
import { SEND_CONTACT } from '../sendContact.gql';

const $ = window.$;
const Form = (props) => {

    const {
        toggleMessages,
        classes
    } = props;

    const {
        message,
        error,
        isLoading,
        sendContact,
        base64file,
        uploadFile
    } = useContact({mutation: SEND_CONTACT});
    
    useEffect(()=>{
        if ((message || error) && !isLoading) {
            smoothScrollToView($("#root"));
            hideFogLoading();
            if (error) {
                // const errors = error.map(error => {
                //     return {
                //         type: 'error',
                //         message: error.message,
                //         auto_dismiss: true
                //     }
                // });
                toggleMessages([{
                    type: 'error',
                    message: error,
                    auto_dismiss: true
                }]);
            } else {
                $('#contact-form .form-control').val('');
                toggleMessages([{
                    type: 'success', 
                    message: Identify.__('Thank you, we will contact you soon !'), 
                    auto_dismiss: true
                }]);
            }
        }
    }, [message, error, isLoading]);

    const validateForm = () => {
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
            toggleMessages([{
                type: 'error', 
                message: Identify.__('Please check some required fields'),
                auto_dismiss: true
            }]);
        }

        return formCheck;
    };

    const onChange = (e) => {
        if(e.target.value !=='' || e.target.value !== null){
            $(e.target).removeClass('is-invalid');
            $(e.target).removeAttr('style')
        }
    }

    const onChangeFile = (e) => {
        const input = e.target;
        const file = input.files && input.files[0] || '';
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                // const result = e.target.result;
                if (reader.result) {
                    let base64 = reader.result.split("base64,");
                    base64 = base64[base64.length-1];
                    base64 = base64.split('"');
                    base64 = base64[0];
                    uploadFile(base64);
                }
            };
            reader.onerror = function (error) {
                console.warn('Error: ', error);
            };
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidated = validateForm()
        const form = $('#contact-form').serializeArray();
        let formData = {};
        if(isValidated){
            for(let i in form){
                let field = form[i];
                formData[field.name] = field.value;
            }
            const attach = document.querySelector('input[name="attach"]');
            formData.attach = attach && attach.files && attach.files[0].name || '';
            formData.base64file = base64file;
            // showFogLoading();
            // sendContact(formData, this.proceedData)
            sendContact(formData);
        }
    }

    // const errorMessage = <small className="message" }>This field is required</small>
    const errorEmail = <small className="invalid-email" style={{display: 'none', color:"#fa0a11"}}>{Identify.__('Invalid email')}</small>

    return (
        <div className={classes['form-container']}>
            <form id="contact-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-section">
                    <h2>{Identify.__("PERSONAL INFO")}</h2>
                </div>

                <div className="form-row">
                    <div className='form-group'>
                        <label htmlFor="firstname">{Identify.__('First name')} <span>*</span></label>
                        <input type="text" onChange={onChange} className={`form-control ${classes['base-textField']} required`} name="firstname" />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="lastname">{Identify.__('Last name')} <span>*</span></label>
                        <input type="text" onChange={onChange} className={`form-control ${classes['base-textField']} required`} name="lastname" />
                    </div>
                </div>
                <div className="form-row">
                    <div className='form-group'>
                        <label htmlFor="email">{Identify.__('E-mail address')} <span>*</span></label>
                        <input type="text" onChange={onChange} className={`form-control ${classes['base-textField']} required`} name="email" />
                        {errorEmail}
                    </div>
                </div>
                <div className="form-row">
                    <div className='form-group'>
                        <label htmlFor="telephone">{Identify.__('Telephone')}</label>
                        <input type="text" onChange={onChange} className={`form-control ${classes['base-textField']}`} name="phone" />
                    </div>
                </div>

                <div className="form-section">
                    <h2>{Identify.__("MESSAGE")}</h2>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="subject">{Identify.__('Subject')}</label>                    
                        <select onChange={onChange} className={`form-control ${classes['base-textField']}`} name="subject">
                            <option value="Inquiry">{Identify.__('Inquiry')}</option>
                            <option value="Refund">{Identify.__('Refund')}</option>
                            <option value="Technical Issue">{Identify.__('Technical Issue')}</option>
                            <option value="Others">{Identify.__('Others')}</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group fg-textarea">
                        <label htmlFor="message">{Identify.__('Message')} <span>*</span></label>                    
                        <textarea onChange={onChange} className={`form-control ${classes['base-textareaField']} required`} name="message" cols="30" rows="5"></textarea>
                    </div>
                </div>

                {/* <div className="form-row">
                    <div className='form-group'>
                        <input type="text" onChange={onChange} className={`form-control ${classes['base-textField']} required`} name="company" placeholder="Company Name *" />
                    </div>
                </div> */}

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="attach">{Identify.__('Attachment')}</label>                    
                        <input type="file" onChange={onChangeFile} className={`form-control ${classes['base-textField']}`} name="attach" />
                        {base64file && <span>{Identify.__('File uploaded!')}</span>}
                    </div>
                </div>
                
                <div className={classes["contact-action-flex"]}>
                    <span className={classes["requirement"]}>{Identify.__('* Required fields')}</span>
                    <Colorbtn type="submit" className={classes['submit-btn']} text="Submit"/>
                </div>
            </form>
        </div>
    );
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
