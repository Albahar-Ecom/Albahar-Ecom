import React, {useState, useEffect} from 'react'
import ArrowRight from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowLeft';
import {cateUrlSuffix, saveDataToUrl} from 'src/simi/Helper/Url';
import { connect } from 'src/drivers';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';
import GET_CATEGORY from 'src/simi/queries/catalog/getCategory';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import {getStore} from '../Helper/Data'

const HomeCatItem = props => {
    const {item, history, isPhone, setSimiNProgressLoading} = props;

    const [clickedLocation, setClickedLocation] = useState(null);

    const handleLink = (location) => {
        history.push(location)
    }

    const store = getStore();

    const clickedCateId = (clickedLocation) ? clickedLocation.cateId : null;
    const {
        data: preFetchResult, 
        error: preFetchError 
    } = useQuery(GET_CATEGORY, {
        variables: {
            id: Number(clickedCateId),
            pageSize: 12,
            currentPage: 1,
            stringId: String(clickedCateId),
            cacheKeyStoreId: String(store.id || 1)
        },
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
    }, [setSimiNProgressLoading, preFetchResult, preFetchError, clickedLocation]);

    const action = () => {
        if (item.url_path) {
            const location = {
                pathname: '/' + item.url_path + cateUrlSuffix(),
                state: {},
                cateId: item.category_id
            }
            // document
            //     .getElementById('root')
            //     .scrollIntoView({ behavior: 'smooth' });
            setSimiNProgressLoading(true);
            setClickedLocation(location);
        }
    }

    if(!item.simicategory_filename && !item.simicategory_filename_tablet) {
        return null;
    }

    let img = '';

    if(isPhone) {
        if(item.simicategory_filename_tablet) {
            img = item.simicategory_filename_tablet;
        } else {
            img = item.simicategory_filename;
        }
    } else {
        if(item.simicategory_filename) {
            img = item.simicategory_filename;
        } else {
            img = item.simicategory_filename_tablet;
        }
    }


    return (

        <div role="presentation" className="home-cate-item" onClick={() => action()}>
            <div className="cate-img">
                <img src={img}
                     alt={item.simicategory_name}/>
            </div>
            <div className="cate-title">
                <div className="blue-background"></div>
                <div className="--text">{item.cat_name || item.simicategory_name}</div>
                <div className="cate-arrow">
                    <ArrowRight color="#ffffff" style={{width:60,height:60}}/>
                </div>
            </div>
            
        </div>
    )
}

const mapDispatchToProps = {
    setSimiNProgressLoading
};

export default connect(null, mapDispatchToProps)(HomeCatItem);