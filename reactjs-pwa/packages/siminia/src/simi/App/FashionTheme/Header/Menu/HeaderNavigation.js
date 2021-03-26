import React from 'react'
import Identify from "src/simi/Helper/Identify"
import HeaderNavMegaitem from './HeaderNavMegaitem'
import { Link } from 'src/drivers';
import {cateUrlSuffix} from 'src/simi/Helper/Url'


class Navigation extends React.Component{
    componentDidMount(){
        if ($('.app-nav') && $('.app-nav').length) {
            let topPx = 0;
            let headerHeight = 0;
            let isSticker = false;
            if ($('.app-nav-main') && $('.app-nav-main').length) {
                topPx = $('.app-nav-main').offset().top;
            }else{
                topPx = $('#id-message').offset().top;
            }
            if ($('.header-wrapper .container-header .header') && $('.header-wrapper .container-header .header').length) {
                headerHeight = $('.header-wrapper .container-header .header').outerHeight();
            }
            let oldMainpageMargintop = 0;
            if ($('#siminia-main-page') && $('#siminia-main-page').length) {
                oldMainpageMargintop = $('#siminia-main-page')[0].style.marginTop || 0;
            }
            $(document).scroll(() => {
                if ($(window).scrollTop() >= topPx) {
                    if (isSticker) return;
                    if ($('.header-wrapper') && $('.header-wrapper').length) {
                        $('.header-wrapper').addClass('sticker')
                    }
                    $('.app-nav').addClass('sticker')
                    if ($('#siminia-main-page') && $('#siminia-main-page').length) {
                        $('#siminia-main-page').css({
                            marginTop: headerHeight + 'px'
                        })
                    }
                    isSticker = true;
                } else {
                    if (!isSticker) return;
                    if ($('.header-wrapper') && $('.header-wrapper').length) {
                        $('.header-wrapper').removeClass('sticker')
                    }
                    $('.app-nav').removeClass('sticker')
                    if ($('#siminia-main-page') && $('#siminia-main-page').length) {
                        $('#siminia-main-page').css({
                            marginTop: oldMainpageMargintop + 'px'
                        })
                    }
                    isSticker = false;
                }
            })
        }
    }

    toggleMegaItemContainer() {
        $(`.main-nav`).find(`.nav-item-container`).each(function() {
            $(this).removeClass('active')
        });
    }

    hoverActiveItem = (e) => {
        const id = e.currentTarget.id || '';
        $(`.app-nav .${id} .sub-item`).addClass('active')
    }
    hoverDisableItem = (e) => {
        const id = e.currentTarget.id || '';
        $(`.app-nav .${id} .sub-item`).removeClass('active')
    }

    render() {
        const { addClassNames } = this.props
        let menuItems = []
        const storeConfig = Identify.getStoreConfig();
        if (storeConfig && storeConfig.simiRootCate && storeConfig.simiRootCate.children) {
            var rootCateChildren  = storeConfig.simiRootCate.children
            rootCateChildren = rootCateChildren.sort(function(a, b){
                return a.position - b.position
            });
            menuItems = rootCateChildren.map((item, index) => {
                var isActive = window.location.pathname.indexOf(item.url_path) === 1 ? 'active':'';

                if(!item.include_in_menu){
                    return null
                }
                if (!item.name)
                    return ''
                if (item.children && item.children.length > 0) {
                    const location = {
                        pathname: '/' + item.url_path + cateUrlSuffix(),
                        state: {}
                    }
                    const navItemContainerId = `nav-item-container-${item.id}`
                    return (
                        <div
                            key={index}
                            id={navItemContainerId}
                            role='button'
                            tabIndex='0'
                            onKeyDown={()=>{}}
                            className={`nav-item-container ${navItemContainerId}`}
                            onFocus={(e) => this.hoverActiveItem(e)}
                            onMouseOver={(e) => this.hoverActiveItem(e)}
                            onBlur={(e) => this.hoverDisableItem(e)}
                            onMouseOut={(e) => this.hoverDisableItem(e)}
                            onClick={(e) => this.hoverDisableItem(e)}
                            >
                            <Link
                                className={'nav-item '+ isActive}
                                to={location}
                                >
                                {Identify.__(item.name)}
                            </Link>
                            <div className="sub-item">
                                <div className="container">
                                    <HeaderNavMegaitem
                                        parentId={item.id}
                                        data={item}
                                        itemAndChild={item}
                                        childCol={2}
                                        toggleMegaItemContainer={()=>this.toggleMegaItemContainer()}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <Link
                            className={"nav-item " +isActive}
                            key={index}
                            to={'/' + item.url_path + cateUrlSuffix()}
                            style={{textDecoration: 'none'}}
                            >
                            {Identify.__(item.name)}
                        </Link>
                    )
                }
            })
        }
        return (
            <div className={`app-nav ${addClassNames ? addClassNames:''}`}>
                <div className="container">
                    <div className="main-nav">
                        {menuItems}
                    </div>
                </div>
            </div>
        );
    }
}
export default Navigation
