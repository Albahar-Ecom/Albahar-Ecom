import React, {useState, useEffect} from 'react'
// import {Colorbtn} from 'src/simi/BaseComponents/Button'
import {productUrlSuffix, cateUrlSuffix, saveDataToUrl} from 'src/simi/Helper/Url';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import Identify from "src/simi/Helper/Identify";
// import { useHistory } from '@magento/venia-drivers';
// import connectorGetProductDetailBySku from 'src/simi/App/AlBahar/queries/catalog/getProductDetailBySku.graphql';
import GET_CATEGORY from 'src/simi/queries/catalog/getCategory';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import {getStore} from '../Helper/Data'
import { useUserContext } from '@magento/peregrine/lib/context/user';

const BannerItem = props => {
    const { history, item, isPhone, setSimiNProgressLoading } = props;

    const [clickedLocation, setClickedLocation] = useState(null);
    // const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const handleLink = (location) => {
        history.push(location)
    }

    const store = getStore();

    const clickedCateId = (clickedLocation) ? clickedLocation.cateId : null;
    const variables = {
        id: Number(clickedCateId),
        pageSize: 12,
        currentPage: 1,
        stringId: String(clickedCateId),
        cacheKeyStoreId: String(store.id || 1)
    }
    if(isSignedIn) {
        variables.loginToken = Identify.randomString()
    }
    const {
        data: preFetchResult, 
        error: preFetchError 
    } = useQuery(GET_CATEGORY, {
        variables,
        skip: !clickedCateId,
        fetchPolicy: "no-cache"
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

    let action = () => {}
    if (parseInt(item.type, 10) === 1) {
        //product detail
        if (item.url_key) {
            action = () => {
                setSimiNProgressLoading(true);
                history.push(item.url_key + productUrlSuffix());
            };
        }
    } else if(parseInt(item.type, 10) === 2){
        //category
        if (item.url_path) {
            action = () => {
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
            };
        }
    } else {
        action = (e) => {
            e.preventDefault();
            window.open(item.banner_url);
        }
    }
    
    
    const w = '100%';
    const h = '100%';
    let img = item.banner_name_tablet;
    if(!item.banner_name_tablet && item.banner_name) {
        img = item.banner_name;
    } else if(isPhone && item.banner_name) {
        img = item.banner_name;
    }

    if(!img) return null

    return (
        <div 
            style={{position: 'relative', maxWidth: w, minHeight: h}} 
            className="banner-item"
            onClick={action}
        >
            <img className="img-responsive" width={w} height={h} src={img} alt={item.banner_title}/>
        </div>
    )
}

const mapDispatchToProps = {
    setSimiNProgressLoading
};
export default connect(null, mapDispatchToProps)(BannerItem);