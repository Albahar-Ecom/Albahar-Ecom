import React, { useState } from 'react';
import Identify from 'src/simi/Helper/Identify';
import Expansion from 'src/simi/App/FashionTheme/BaseComponents/Expansion';
import classes from './ProxyClasses';
import { Link } from 'src/drivers';
import Subscriber from './Subscriber';
import { useWindowSize } from '@magento/peregrine';

require('./footer.scss');

const Footer = (props) => {
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    const [expanded, setExpanded] = useState(null);

    const help = [
        {
            id: 1,
            link: '/about-us-fashion',
            title: Identify.__('About us')
        },
        {
            id: 2,
            link: '#',
            title: Identify.__('Store Location')
        },
        {
            id: 3,
            link: '#',
            title: Identify.__('Delivery')
        },
        {
            id: 4,
            link: '#',
            title: Identify.__('Returns')
        }
    ];
    const siteInfo = [
        {
            id: 1,
            link: '/term-condition-fashion',
            title: Identify.__('Term & Conditions')
        },
        {
            id: 2,
            link: '/privacy-policy-fashion',
            title: Identify.__('Privacy Policy')
        },
        {
            id: 3,
            link: '#',
            title: Identify.__('Cookie Policy')
        },
        {
            id: 4,
            link: '#',
            title: Identify.__('Contact us')
        }
    ];
    const company = [
        {
            id: 1,
            link: '#',
            title: Identify.__('Careers')
        },
        {
            id: 2,
            link: '#',
            title: Identify.__('Licensing')
        },
        {
            id: 3,
            link: '#',
            title: Identify.__('Affiliates')
        },
        {
            id: 4,
            link: '#',
            title: Identify.__('Investor Relations')
        }
    ];
    const contact = [
        {
            id: 1,
            link: '#',
            title: Identify.__('support@simicart.com'),
            type: 'contact'
        },
        {
            id: 2,
            link: '#',
            title: Identify.__('204, Hanoi, Vietnam'),
            type: 'contact'
        }
    ];

    const listPages = (pages) => {
        let result = null;
        if (pages.length > 0) {
            result = pages.map((page, index) => {
                return (
                    <li key={index} className="contact_us">
                        {page.type === 'contact' && page.id === 1 && <i className="icon-telephone icon"></i>}
                        {page.type === 'contact' && page.id === 2 && <i className="icon-envelope-open icon"></i>}
                        {page.type === 'contact' && page.id === 3 && <i className="icon-map-marker icon"></i>}
                        <Link to={page.link}>{page.title}</Link>
                    </li>
                );
            });
        }

        return <ul>{result}</ul>;
    };

    const handleExpand = (expanded) => {
        setExpanded(expanded);
    };

    return (
        <React.Fragment>
            <div className={'simi-fadein ' + classes['footer-app'] + (isPhone ? ' on-mobile' : '')}>
                <div className={classes['footer-wrapper']}>
                    <div className={`container`}>
                        <div className={`row`}>
                            <div className={`col-md-12 col-sm-12 col-xs-12`}>
                                <div className="footer-subscriber">
                                    <div className="column1">
                                        <h3>{Identify.__('subscribe newsletter')}</h3>
                                        <p>{Identify.__('Lastest news and get early access to collection previews')}</p>
                                    </div>
                                    <div className="column2">
                                        <Subscriber key={Identify.isRtl()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`container list-item`}>
                        <div className={`row`}>
                            <div className={`col-md-3 one-col`}>
                                {!isPhone ? (
                                    <React.Fragment>
                                        <span className={classes['footer--title']}>{Identify.__('Help')}</span>
                                        <ul>
                                            {help.map((page, index) => {
                                                return (
                                                    <li key={index}>
                                                        <Link to={page.link}>{page.title}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </React.Fragment>
                                ) : (
                                        <div className={`footer-mobile`}>
                                            <Expansion
                                                id={`expan-1`}
                                                title={Identify.__('Help')}
                                                icon_color="#FFFFFF"
                                                handleExpand={(expanId) => handleExpand(expanId)}
                                                expanded={expanded}
                                                content={listPages(help)}
                                            />
                                        </div>
                                    )}
                            </div>

                            <div className={`col-md-3 one-col`}>
                                {!isPhone ? (
                                    <React.Fragment>
                                        <span className={classes['footer--title']}>{Identify.__('Site Info')}</span>
                                        <ul>
                                            {siteInfo.map((page, index) => {
                                                return (
                                                    <li key={index} >
                                                        <Link to={page.link}>{page.title}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </React.Fragment>
                                ) : (
                                        <div className={`footer-mobile`}>
                                            <Expansion
                                                id={`expan-2`}
                                                title={Identify.__('Site Info')}
                                                content={listPages(siteInfo)}
                                                icon_color="#FFFFFF"
                                                handleExpand={(expanId) => handleExpand(expanId)}
                                                expanded={expanded}
                                            />
                                        </div>
                                    )}
                            </div>

                            <div className={`col-md-3 one-col`}>
                                {!isPhone ? (
                                    <React.Fragment>
                                        <span className={classes['footer--title']}>{Identify.__('Company')}</span>
                                        <ul>
                                            {company.map((page, index) => {
                                                return (
                                                    <li key={index} >
                                                        <Link to={page.link}>{page.title}</Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </React.Fragment>
                                ) : (
                                        <div className={`footer-mobile`}>
                                            <Expansion
                                                id={`expan-3`}
                                                title={Identify.__('Company')}
                                                icon_color="#FFFFFF"
                                                handleExpand={(expanId) => handleExpand(expanId)}
                                                expanded={expanded}
                                                content={listPages(company)}
                                            />
                                        </div>
                                    )}
                            </div>

                            <div className={`col-md-3 one-col`}>
                                {!isPhone ? (
                                    <React.Fragment>
                                        <span className={classes['footer--title']}>{Identify.__('Contact')}</span>
                                        <ul>
                                            {contact.map((page, index) => {
                                                return (
                                                    <li key={index} className="contact_us">
                                                        {page.id === 1 && <i className="icon-telephone icon"></i>}
                                                        {page.id === 2 && <i className="icon-envelope-open icon"></i>}
                                                        {page.id === 3 && <i className="icon-map-marker icon"></i>}
                                                        <Link to={page.link}>{page.title}</Link>
                                                    </li>
                                                );
                                            })}
                                            <li>
                                                <div className={classes['social-icon']}>
                                                    <a href={"https://facebook.com"} target="__blank">
                                                        <div className={classes['facebook-icon']} ></div>
                                                    </a>
                                                    <a href={"https://instagram.com"} target="__blank">
                                                        <div className={classes['instagram-icon']} ></div>
                                                    </a>
                                                    <a href={"https://twitter.com"} target="__blank">
                                                        <div className={classes['twitter-icon']} ></div>
                                                    </a>
                                                    <a href={"https://pinterest.com"} target="__blank">
                                                        <div className={classes['pinterest-icon']} ></div>
                                                    </a>
                                                </div>
                                            </li>
                                        </ul>
                                    </React.Fragment>
                                ) : (
                                        <div className={`footer-mobile download-app`}>
                                            <Expansion
                                                id={`expan-4`}
                                                title={Identify.__('Contact')}
                                                icon_color="#FFFFFF"
                                                handleExpand={(expanId) => handleExpand(expanId)}
                                                expanded={expanded}
                                                content={listPages(contact)}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`mobile-social`}>
                    {!isPhone ? (<></>) : (
                        <div className={`footer-mobile-social`}>
                            <a href={"https://facebook.com"} target="__blank">
                                <div className={classes['facebook-icon social-icon']} ></div>
                            </a>
                            <a href={"https://twitter.com"} target="__blank">
                                <div className={classes['twitter-icon social-icon']} ></div>
                            </a>
                            <a href={"https://instagram.com"} target="__blank">
                                <div className={classes['instagram-icon social-icon']} ></div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
export default Footer;
