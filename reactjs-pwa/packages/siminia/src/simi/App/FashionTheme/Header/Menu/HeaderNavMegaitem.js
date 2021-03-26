import React from 'react';
import { Link } from 'src/drivers';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import Identify from 'src/simi/Helper/Identify';

const NavMegaitem = props => {
    if (props.itemAndChild) {
        const { parentId } = props;
        const rootItem = props.itemAndChild;
        if (rootItem.children) {
            const childCats = rootItem.children.map((item, index) => {
                if (!item.name) return '';
                let subChildLevel2 = [];
                if (item.children) {
                    subChildLevel2 = item.children
                        .slice(0, 5)
                        .map((itemlv2, indexlv2) => {
                            if (!itemlv2.name) return '';
                            const path = itemlv2.url_path
                                ? '/' + itemlv2.url_path + cateUrlSuffix()
                                : itemlv2.link;
                            const location = {
                                pathname: path,
                                state: {}
                            };
                            if (itemlv2.children)
                                location.state.category_page_id =
                                    itemlv2.entity_id;
                            return (
                                <Link
                                    className='mega-lv2-name'
                                    key={indexlv2}
                                    to={location}
                                >
                                    {itemlv2.name}
                                </Link>
                            );
                        });
                }
                const location = {
                    pathname: item.url_path
                        ? '/' + item.url_path + cateUrlSuffix()
                        : item.link,
                    state: {}
                };

                return (
                    <div key={index} className="mega-lv1-list">
                        <Link
                            className='mega-lv1-name'
                            to={location}
                        >
                            {item.name}
                        </Link>
                        {subChildLevel2.length > 0 &&
                            <div className='mega-lv1-sub-cats'>
                                {subChildLevel2}
                                {subChildLevel2.length >= 5 && (
                                    <Link
                                        to={location}
                                        style={{
                                            color: '#727272',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {Identify.__('See more')}
                                    </Link>
                                )}
                            </div>
                        }
                    </div>
                );
            });

            const className = `nav-mega-item ${parentId ? 'sub-item-nav-item-container-'+parentId:''}`

            return (
                <div className={className} id={props.id}>
                    <div
                        role="presentation"
                        className='mega-content'
                        onClick={() => {
                            if (props.toggleMegaItemContainer)
                                props.toggleMegaItemContainer();
                        }}
                    >
                     
                        {childCats}
                        
                    </div>
                    {   
                        rootItem.image && <div className={`mega-image hidden-xs`}>
                            <img
                                src={rootItem.image}
                                alt={rootItem.image_url}
                            />
                        </div>
                    }
                </div>
            );
        }
    }
    return '';
};
export default NavMegaitem;
