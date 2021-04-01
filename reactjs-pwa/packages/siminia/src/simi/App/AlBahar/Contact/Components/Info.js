import React from 'react';
import EmailIcon from '../../../../BaseComponents/Icon/TapitaIcons/Email';
import Phone from '../../../../BaseComponents/Icon/TapitaIcons/Phone-call';
import Home from '../../../../BaseComponents/Icon/TapitaIcons/Homepage';
import Identify from 'src/simi/Helper/Identify'
import classify from "src/classify";
import defaultClasses from "../style.css";

const Info = (props) => {
    const { classes } = props;
    const storeConfig = Identify.getStoreConfig();
    let contactus = null;
    let listEmails = [];
    let listHotlines = [];
    let listSmsPhoneNumber = [];
    let listWebsites = [];
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.pwacontactus) {
        contactus = storeConfig.simiStoreConfig.config.pwacontactus
    }

    const {
        listEmail,
        listHotline,
        listSms,
        listWebsite,
        listOther: listOthers,
    } = contactus || {}

    if (listEmail) {
        listEmails = listEmail
    }
    if (listHotline) {
        listHotlines = listHotline
    }
    if (listSms) {
        listSmsPhoneNumber = listSms
    }
    if (listWebsite) {
        listWebsites = listWebsite
    }

    const listEmailHtml = (list) => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`mailto:${item.contact_email}`}>{item.contact_email}</a>
                </li>
            )
        })
        return html
    }

    const listHotlinelHtml = (list) => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`tel:${item.contact_hotline}`}>{item.contact_hotline}</a>
                </li>
            )
        })
        return html
    }

    const listSmslHtml = (list) => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={`tel:${item.contact_sms}`}>{item.contact_sms}</a>
                </li>
            )
        })
        return html
    }
    const listWebsitelHtml = (list) => {
        let html = null;
        html = list.map((item, index) => {
            return (
                <li key={index} className="sub-item">
                    <a href={item.contact_website}>{item.contact_website}</a>
                </li>
            )
        })
        return html
    }

    return (
        <div className={classes['contact-info']}>
            <h1>{Identify.__('Contact Us')}</h1>

            {listHotlines.length > 0 && <div className={classes['contact-item']}>
                {/* <div className="contact-item-icon">
                    <Phone />
                </div> */}
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("Hotline")}
                    </div>
                    <ul className="list-sub-item">
                        {listHotlinelHtml(listHotlines)}
                    </ul>
                </div>
            </div>}

            {listSmsPhoneNumber.length > 0 && <div className={classes['contact-item']}>
                {/* <div className="contact-item-icon">
                    <EmailIcon />
                </div> */}
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("Whatsapp (Through website)")}
                    </div>
                    <ul className="list-sub-item">
                        {listSmslHtml(listSmsPhoneNumber)}
                    </ul>
                </div>
            </div>}

            {listEmails.length > 0 && <div className={classes['contact-item']}>
                {/* <div className="contact-item-icon">
                    <EmailIcon />
                </div> */}
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("Email")}
                    </div>
                    <ul className="list-sub-item">
                        {listEmailHtml(listEmails)}
                    </ul>
                </div>
            </div>}

            {listWebsites.length > 0 && <div className={classes['contact-item']}>
                {/* <div className="contact-item-icon">
                    <Home />
                </div> */}
                <div className={classes['item-content']}>
                    <div className={classes['contact-title']}>
                        {Identify.__("website")}
                    </div>
                    <ul className="list-sub-item">
                        {listWebsitelHtml(listWebsites)}
                    </ul>
                </div>
            </div>}

            {listOthers && listOthers.length > 0 && listOthers.map((item, index) => {
                if (!item.value) return null;
                return <div className={classes['contact-item']}>
                    {/* <div className="contact-item-icon">
                        <Home />
                    </div> */}
                    <div className={classes['item-content']} key={index}>
                        <div className={classes['contact-title']}>
                            {Identify.__(item.label)}
                        </div>
                        <ul className="list-sub-item">
                            <li>{item.value}</li>
                        </ul>
                    </div>
                </div>
            })}
        </div>
    )
}

export default classify(defaultClasses)(Info);