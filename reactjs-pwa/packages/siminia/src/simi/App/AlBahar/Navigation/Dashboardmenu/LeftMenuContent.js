import React from 'react'
import MenuItem from 'src/simi/BaseComponents/MenuItem'
import {configColor} from 'src/simi/Config';
import Identify from "src/simi/Helper/Identify"
import UserIcon from 'src/simi/BaseComponents/Icon/TapitaIcons/User'
import MyBusiness from 'src/simi/App/AlBahar/BaseComponents/Icon/MyBusiness'
import PropTypes from 'prop-types'
import CateTree from './CateTree'
import Setting from './Setting'
import { connect } from 'src/drivers';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';

const styles = {
    iconMenu : {
        fill : configColor.menu_icon_color,
        width: 18,
        height: 18
    },
    menu : {
        color : configColor.menu_text_color,
    },
    divider : {
        backgroundColor : configColor.menu_line_color
    }
}
class LeftMenuContent extends React.Component{

    constructor(props) {
        super(props);
        this.parent=this.props.parent;
    }

    handleLink = (location) => {
        this.props.handleLink(location)
    }

    handleMenuItem =(item)=>{
        if(item && item.url){
            this.handleLink(item.url)
        } else if (item && item.pathname) {
            this.handleLink(item)
        }
        this.props.setSimiNProgressLoading(true);
    }

    componentDidMount(){
        this.props.setSimiNProgressLoading(false);
    }

    renderSections() {
        const {classes} = this.props
        return (
            <React.Fragment>
                <div className={classes['top-menu']}>
                    <MenuItem 
                        classes={classes}
                        icon={<UserIcon style={styles.iconMenu}/>}
                        titleStyle={styles.menu}
                        title={Identify.__('My Account')}
                        onClick={()=>this.handleLink(this.props.isSignedIn ? '/account.html' : '/login.html')}
                    />
                    <div className={classes['separate-line']}></div>
                    <MenuItem 
                        classes={classes}
                        icon={<MyBusiness />}
                        // titleStyle={styles.menu}
                        title={Identify.__('Brand')}
                        onClick={()=>this.handleLink('/brand.html')}
                    />
                </div>
    
                <CateTree
                    classes={classes}
                    handleMenuItem={this.handleMenuItem.bind(this)}
                    hideHeader={false}
                    defaultExpandedRoot={true}/>
                <Setting parent={this} style={styles} classes={classes}/>
            </React.Fragment>
        )
    }

    render(){
        const {classes} = this.props
        return (
            <div className={classes["list-menu-header"]} style={{maxHeight:window.innerHeight}}>
                {this.renderSections()}
            </div>
        )
    }
}

LeftMenuContent.contextTypes = {
    classes: PropTypes.object
};

const mapDispatchToProps = {
    setSimiNProgressLoading
};

const mapStateToProps = ({ user }) => { 
    const { isSignedIn } = user;
    return {
        isSignedIn
    }; 
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(LeftMenuContent);
