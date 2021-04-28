import React from 'react'
import ArrowRight from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowLeft';
import {cateUrlSuffix} from 'src/simi/Helper/Url';
import { connect } from 'src/drivers';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';

const HomeCatItem = props => {
    const {item, history, isPhone, setSimiNProgressLoading} = props;

    const action = () => {
        if (item.url_path) {
            setSimiNProgressLoading(true);
            history.push(item.url_path + cateUrlSuffix());
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
                <div className="--text">{item.simicategory_name}</div>
            </div>
            <div className="cate-arrow">
                <ArrowRight color="#0082ff" style={{width:60,height:60, fill: '#0082ff'}}/>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    setSimiNProgressLoading
};

export default connect(null, mapDispatchToProps)(HomeCatItem);