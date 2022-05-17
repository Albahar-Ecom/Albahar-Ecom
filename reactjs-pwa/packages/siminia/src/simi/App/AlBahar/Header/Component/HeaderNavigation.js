import React, {useState, useEffect} from 'react'
import Identify from "src/simi/Helper/Identify"
import HeaderNavMegaitem from './HeaderNavMegaitem';
import { Link, connect } from 'src/drivers';
import NavTrigger from './navTrigger';
import MenuIcon from 'src/simi/BaseComponents/Icon/Menu';
import { cateUrlSuffix, saveDataToUrl } from 'src/simi/Helper/Url';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';
import { useHistory } from '@magento/venia-drivers';
import GET_CATEGORY from 'src/simi/queries/catalog/getCategory';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import {getElectronicConfig} from '../../Helper/Data'

const Navigation = (props) => {

    const {classes, setSimiNProgressLoading} = props;
    const [{ isSignedIn }] = useUserContext();
    const [clickedLocation, setClickedLocation] = useState(null);
    const electronicConfig = getElectronicConfig()
    const history = useHistory();

    const handleLink = (location) => {
        history.push(location)
    }

    const toggleMegaItemContainer = () => {
        $(`.${classes['main-nav']}`).find(`.${classes['nav-item-container']}`).each(function () {
            $(this).removeClass(classes['active'])
        });
    }

    const storeData = Identify.getStoreConfig();
    const {storeConfig} = storeData || {}
    const {id: storeId} = storeConfig || {}

    const clickedCateId = (clickedLocation) ? clickedLocation.cateId : null;
    const variables = {
        id: Number(clickedCateId),
        pageSize: 12,
        currentPage: 1,
        stringId: String(clickedCateId),
        storeId: storeId || 0,
        simiStoreId: storeId || 0
    }
    if(isSignedIn) {
        variables.loginToken = Identify.randomString()
    }
    const {
        data: preFetchResult, 
        error: preFetchError 
    } = useQuery(GET_CATEGORY, {
        variables,
        skip: !clickedCateId
    });

    useEffect(() => {
        if (preFetchResult && clickedLocation) {
            if (preFetchResult) {
                saveDataToUrl(clickedLocation.pathname, Object.assign({}, preFetchResult, { id: clickedCateId }), false);
            }
            setSimiNProgressLoading(false);
            setClickedLocation(false);
            handleLink(clickedLocation);
        } else if (preFetchResult || preFetchError) {
            setSimiNProgressLoading(false)
            if (clickedLocation)
                handleLink(clickedLocation)
        }
    }, [setSimiNProgressLoading, preFetchResult, preFetchError, clickedLocation])

    let menuItems = [];
    const showMenuTrigger = false;
    if (window.DESKTOP_MENU) {
        const menuItemsData = window.DESKTOP_MENU;
        menuItems = menuItemsData.map((item, index) => {
            if (item.children && item.children.length > 0) {
                let title = item.name
                if (item.link) {
                    const location = {
                        pathname: item.link,
                        state: {}
                    }
                    title = (
                        <Link
                            className={classes["nav-item"]}
                            to={location}>
                            {Identify.__(item.name)}
                        </Link>
                    )
                }

                const navItemContainerId = `nav-item-container-${item.menu_item_id}`
                return (
                    <div
                        key={index}
                        id={navItemContainerId}
                        className={`${classes['nav-item-container']} nav-item-container`}
                        onFocus={() => {
                            $(`#${navItemContainerId}`).addClass(classes['active'])
                        }}
                        onMouseOver={() => {
                            $(`#${navItemContainerId}`).addClass(classes['active'])
                        }}
                        onBlur={() => {
                            $(`#${navItemContainerId}`).removeClass(classes['active'])
                        }}
                        onMouseOut={() => {
                            $(`#${navItemContainerId}`).removeClass(classes['active'])
                        }}>
                        {title}
                        <HeaderNavMegaitem
                            classes={classes}
                            data={item}
                            itemAndChild={item}
                            toggleMegaItemContainer={() => toggleMegaItemContainer()}
                        />
                    </div>
                )
            } else {
                if (item.link && item.link.includes('http')) {
                    return (
                        <a
                            className={`${classes["nav-item"]} nav-item nav-item-container`}
                            key={index}
                            href={item.link ? item.link : '/'}
                            style={{ color: 'white', textDecoration: 'none' }}
                        >
                            {Identify.__(item.name)}
                        </a>
                    )
                }
                return (
                    <Link
                        className={`${classes["nav-item"]} nav-item nav-item-container`}
                        key={index}
                        to={item.link ? `${item.link}` : '/'}
                        style={{ color: 'white', textDecoration: 'none' }}>
                        {Identify.__(item.name)}
                    </Link>
                )
            }
        })
    } else {
        const storeConfig = Identify.getStoreConfig();
        if (storeConfig && storeConfig.simiRootCate && storeConfig.simiRootCate.children) {
            const rootCateChildren = storeConfig.simiRootCate.children;
            rootCateChildren.sort((a, b) => a.position - b.position);
            menuItems = rootCateChildren.map((item, index) => {
                if (!item.name || !item.include_in_menu)
                    return ''
                const location = {
                    pathname: '/' + item.url_path + cateUrlSuffix(),
                    state: {},
                    cateId: item.id
                }
                if (item.children && item.children.length && item.children.some(({ include_in_menu }) => include_in_menu === 1)) {
                    const title = (
                        <Link
                            className={`${classes["nav-item"]} nav-item nav-item-container`}
                            to={location}
                            onClick={e => {
                                e.preventDefault()
                                document
                                    .getElementById('root')
                                    .scrollIntoView({ behavior: 'smooth' });
                                setSimiNProgressLoading(true);
                                setClickedLocation(location);
                            }}
                        >
                            {Identify.__(item.name)}
                        </Link>
                    )

                    const navItemContainerId = `nav-item-container-${item.id}`
                    return (
                        <div
                            key={index}
                            id={navItemContainerId}
                            className={`${classes['nav-item-container']} nav-item nav-item-container`}
                            onFocus={() => {
                                $(`#${navItemContainerId}`).addClass(classes['active'])
                            }}
                            onMouseOver={() => {
                                $(`#${navItemContainerId}`).addClass(classes['active'])
                            }}
                            onBlur={() => {
                                $(`#${navItemContainerId}`).removeClass(classes['active'])
                            }}
                            onMouseOut={() => {
                                $(`#${navItemContainerId}`).removeClass(classes['active'])
                            }}>
                            {title}
                            <HeaderNavMegaitem
                                classes={classes}
                                data={item}
                                itemAndChild={item}
                                setSimiNprogressLoading={setSimiNProgressLoading}
                                setClickedLocation={setClickedLocation}
                                toggleMegaItemContainer={() => toggleMegaItemContainer()}
                            />
                        </div>
                    )
                } else {
                    return (
                        <Link className={`${classes["nav-item"]} nav-item nav-item-container`}
                            key={index} to={'/' + item.url_path + cateUrlSuffix()}
                            style={{ color: 'white', textDecoration: 'none' }}
                            onClick={e => {
                                e.preventDefault()
                                document
                                    .getElementById('root')
                                    .scrollIntoView({ behavior: 'smooth' });
                                setSimiNProgressLoading(true);
                                setClickedLocation(location);
                            }}
                        >
                            {Identify.__(item.name)}
                        </Link>
                    )
                }
            })
        } else {
            return ''
        }
    }


    let url = 'https://cloud9albahar.com/'
    if(electronicConfig && electronicConfig.url) {
        url = electronicConfig.url
    }
    if(storeData && storeData.storeConfig && storeData.storeConfig.locale) {
        if(storeData.storeConfig.locale === 'ar_KW') {
            url = `${url}?lang=Arabic`
        } else {
            url = `${url}?lang=English`
        }
   
    }
    return (
        <div className={classes["app-nav"]}>
            <div className="container">
                <div className={`${classes["main-nav"]} main-nav`}>
                    {
                        showMenuTrigger &&
                        <NavTrigger>
                            <MenuIcon color="white" style={{ width: 30, height: 30 }} />
                        </NavTrigger>
                    }
                    {menuItems}
                    <Link className={`${classes["nav-item"]} nav-item nav-item-container`}
                        key={'brand'} to={'/brand.html'}
                        style={{ color: 'white', textDecoration: 'none' }}>
                        {Identify.__('Brands')}
                    </Link>
                    <a className={`${classes["nav-item"]} nav-item nav-item-container`} target='_blank' href={url}>{Identify.__("Electronics")}</a>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = {
    setSimiNProgressLoading
};

export default connect(
    null, mapDispatchToProps
)(Navigation);