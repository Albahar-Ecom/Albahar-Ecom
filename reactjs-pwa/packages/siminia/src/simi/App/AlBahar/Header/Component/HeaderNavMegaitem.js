import React from 'react'
import { Link } from 'src/drivers';
import {cateUrlSuffix} from 'src/simi/Helper/Url'

const NavMegaitem = props => {
    if (props.itemAndChild) {
        const { classes, setSimiNprogressLoading, setClickedLocation } = props
        const rootItem = props.itemAndChild
        if (rootItem.children) {
            rootItem.children.sort((a, b)=> a.position - b.position)
            const childCats = rootItem.children.map((item, index) => {
                if (!item.name || !item.include_in_menu)
                    return ''
                let childLevel3 = []
                if (item.children) {
                    childLevel3 = item.children.map((itemlv3, indexlv3)=> {
                        if (!itemlv3.name)
                            return ''
                        const path = itemlv3.url_path?('/' + itemlv3.url_path + cateUrlSuffix()):itemlv3.link
                        const location = {
                            pathname: path,
                            state: {},
                            cateId: itemlv3.id
                        }
                        if (itemlv3.children)
                            location.state.category_page_id = itemlv3.entity_id

                        return (
                            <Link 
                                className={`${classes["mega-lv2-name"]} mega-lv2-name`}
                                key={indexlv3} 
                                to={location}
                                onClick={e => {
                                    e.preventDefault();
                                    document
                                        .getElementById('root')
                                        .scrollIntoView({ behavior: 'smooth' });
                                    setSimiNprogressLoading(true);
                                    setClickedLocation(location);
                                }}
                            >
                                {itemlv3.name}
                            </Link>
                        )
                    })
                }
                const location = {
                    pathname: item.url_path?('/' + item.url_path + cateUrlSuffix()):item.link,
                    state: {},
                    cateId: item.id
                }
                return (
                    <div key={index}>
                        <Link
                            className={`${classes["mega-lv1-name"]} mega-lv2-name`}
                            to={location}
                            onClick={e => {
                                e.preventDefault();
                                document
                                    .getElementById('root')
                                    .scrollIntoView({ behavior: 'smooth' });
                                setSimiNprogressLoading(true);
                                setClickedLocation(location);
                            }}
                        >
                            {item.name}
                        </Link>
                        <div className={`${classes["mega-lv1-sub-cats"]}  mega-lv1-sub-cats`}>
                            {childLevel3}
                        </div>
                    </div>
                )
            })
            // const childCatGroups = []
            // const chunkSize = Math.ceil(childCats.length/3)
            // for (var i = 0; i < childCats.length; i+= chunkSize){
            //     childCatGroups.push(
            //         <div key={i} style={{width: 173, marginRight: 82}}>
            //             {childCats.slice(i,i+chunkSize)}
            //         </div>
            //     );
            // }

            return (
                <div className={`${classes["nav-mega-item"]} nav-mega-item`} id={props.id}>
                    <div 
                    role="presentation"
                    className={`${classes["mega-content"]} mega-content`}
                    onClick={() => {
                        if (props.toggleMegaItemContainer)
                            props.toggleMegaItemContainer()}
                        }>
                        {childCats}
                    </div>
                    {/* {
                        rootItem.image_url && (
                            <div className={`${classes["mega-image"]} mega-image hidden-xs`}>
                                <img src={rootItem.image_url} alt={rootItem.image_url}/>
                            </div>
                        )
                    } */}
                </div>
            )
        }
    }
    return ''
}
export default NavMegaitem