import React, { useState } from 'react';
import defaultStyle from './style.css';
import classify from 'src/classify';
// import Newsletter from './Newsletter';
import Identify from "src/simi/Helper/Identify";
import { Link } from 'src/drivers';
import Copyright from './Copyright';
import Facebook from 'src/simi/BaseComponents/Icon/Facebook'
import Twitter from 'src/simi/BaseComponents/Icon/Twitter'
import Instagram from 'src/simi/BaseComponents/Icon/Instagram'
import Expansion from 'src/simi/App/AlBahar/BaseComponents/Expansion'
import { useWindowSize } from '@magento/peregrine';
import Newsletter from './Newsletter'
import {getFooterConfig, getPwaContact} from '../Helper/Data'

const Footer = props => {
    const { classes } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const [expanded, setExpanded] = useState(null);
    const footerConfig = getFooterConfig()
    const pwaContact = getPwaContact()
    let menus1 = []
    let menuTitle1 = null
    if(footerConfig && footerConfig.menu_title_1) {
        menuTitle1 = footerConfig.menu_title_1
    }
    if(footerConfig &&  footerConfig.menus_1) {
        menus1 = footerConfig.menus_1
    }
    let menus2 = []
    let menuTitle2 = null
    if(footerConfig && footerConfig.menu_title_2) {
        menuTitle2 = footerConfig && footerConfig.menu_title_2
    }
    if(footerConfig && footerConfig.menus_2) {
        menus2 = footerConfig.menus_2
    }
    let facebookLink = null;
    if(footerConfig && footerConfig.facebook_link) {
        facebookLink = footerConfig.facebook_link
    }
    let twitterLink = null;
    if(footerConfig && footerConfig.twitter_link) {
        twitterLink = footerConfig.twitter_link
    }
    let instagramLink = null;
    if(footerConfig && footerConfig.instagram_link) {
        instagramLink = footerConfig.instagram_link
    }
    let hostline = null;

    if( pwaContact 
        && pwaContact.listHotline 
        && pwaContact.listHotline.length > 0
        && pwaContact.listHotline.length > 0
        && pwaContact.listHotline[0].contact_hotline
    ) {
        hostline = pwaContact.listHotline[0].contact_hotline
    }
    const pagec1 = 1;
    const pagep2 = 2;

    const listPages = pages => {

        let result = null;
        if (pages.length > 0) {
            result = pages.map((page, index) => {
                if(page.url && page.text) {
                    return (
                        <li key={index}>
                            <Link to={page.url}>{Identify.__(page.text)}</Link>
                        </li>
                    );
                }
            })
        }

        return <ul>{result}</ul>;
    }

    const handleExpand = (expanded) => {
        setExpanded(expanded);
    }
    
    return (
        <div className={classes['footer-app']}>
            {/* <Newsletter classes={classes}/> */}
            <div className={classes['footer-middle']}>
                <div className={`container ${classes['col-mobile-pd-0']}`}>
                    <div className={`row ${classes['app--flex']}`}>
                        <div className={`${classes['col-custom-20pr']} ${classes['col-mobile-pd-0']}`}>
                            {!isPhone ? <React.Fragment>
                                {menuTitle1 && <span className={classes["footer--custom_title"]}>
                                    {Identify.__(menuTitle1)}
                                </span>}
                                {listPages(menus1)}
                            </React.Fragment> : <Expansion id={pagec1} title={Identify.__(menuTitle1 || "")} content={listPages(menus1)} icon_color="#333" handleExpand={(pagec1) => handleExpand(pagec1)} expanded={expanded} />}
                        </div>
                        <div className={`${classes['col-custom-20pr']} ${classes['col-mobile-pd-0']}`}>
                            {!isPhone ? <React.Fragment>
                                {menuTitle2 && <span className={classes["footer--custom_title"]}>
                                    {Identify.__(menuTitle2)}
                                </span>}
                                {listPages(menus2)}
                            </React.Fragment> : <Expansion id={pagep2} title={Identify.__(menuTitle2 || "")} content={listPages(menus2)} icon_color="#333" handleExpand={(pagep2) => handleExpand(pagep2)} expanded={expanded} />}
                        </div>
                         <div className={`${classes['col-custom-20pr']}`}>
                            <span className={classes["footer--custom_title"]}>
                                {Identify.__("Newsletter")}
                            </span>
                            <span className={classes["footer--custom_desc"]}>
                                {Identify.__("Sign Up for Our Newsletter:")}
                            </span>
                            <Newsletter classes={classes} />
                        </div>
                        <div className={`${classes["col-custom-20pr"]}`}>
                            <span className={classes["footer--custom_title"]}>
                                {Identify.__("Get in touch today on")}
                            </span>
                            {hostline && <ul className={classes["list-contact"]}>
                                <li>
                                    <a href={`tel:${hostline}`}>{hostline}</a>
                                </li>
                            </ul>}
                            <span
                                className={classes["footer--custom_title"]}
                                style={{
                                    display: "block",
                                    marginTop: "30px"
                                }}
                            >
                                {Identify.__("Connect")}
                            </span>
                            <div className={classes["social__md-block"]}>
                                {facebookLink && <a href={facebookLink} target="__blank">
                                    <Facebook className={classes["facebook-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>}
                                {twitterLink && <a href={twitterLink} target="__blank">
                                    <Twitter className={classes["twitter-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>}
                                {instagramLink && <a href={instagramLink} target="__blank">
                                    <Instagram className={classes["instagram-icon"]} style={{ width: "50px", height: "50px" }} />
                                </a>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Copyright isPhone={isPhone} classes={classes} />
        </div>
    )
}
export default classify(defaultStyle)(Footer)
