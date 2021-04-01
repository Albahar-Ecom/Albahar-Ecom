import React, { useEffect } from 'react';
import ContactForm from './Components/Form';
import Info from './Components/Info';
import { compose } from 'redux';
import classify from "src/classify";
import defaultClasses from "./style.css";
import TitleHelper from 'src/simi/Helper/TitleHelper';
import Identify from 'src/simi/Helper/Identify';
import BreadCrumb from "src/simi/BaseComponents/BreadCrumb";
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

require('./style.scss');

const Contact = props => {

    const {classes} = props;

    useEffect(() => {
        smoothScrollToView($('#root'));
    }, []);

    return (
        <div className={`contact-page ${classes['contact-page']}`}>
            {TitleHelper.renderMetaHeader({
                title: Identify.__("Contact"),
                desc: Identify.__("Contact")
            })}
            <BreadCrumb breadcrumb={[{ name: 'Home', link: '/' }, { name: 'Contact Us' }]} />
            <div className="container">
                <div className="col-xs-12 col-sm-12">
                    <Info />
                </div>
                <div className="col-xs-12 col-sm-12">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}

export default compose(classify(defaultClasses))(Contact);