import React from 'react'
import Identify from "src/simi/Helper/Identify";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Storeview from "src/simi/App/FashionTheme/BaseComponents/Settings/Storeview";
import Currency from "src/simi/BaseComponents/Settings/Currency/index"

class Settings extends React.Component{
    state = {
        open: false,
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ open: false });
    };

    renderSettingOptions = ()=>{
        const { open } = this.state;
        const storeConfig = Identify.getStoreConfig()
        if (storeConfig && storeConfig.availableStores && (storeConfig.availableStores.length > 1)) {
            this.storeViewOptions = <Storeview className='storeview-item' classes={{}} storeviewLabel={this.storeName}/>
        }
        
        const hasCurrencyConfig = storeConfig.simiStoreConfig.config.base.currencies.length > 1
        this.currencyOptions = false
        if (hasCurrencyConfig)
            this.currencyOptions = <Currency className='currency-item' classes={{}} currencyLabel={this.currencyName}/>
        if (!this.storeViewOptions && !this.currencyOptions)
            return false
        return (
            <Popper open={open} anchorEl={this.anchorEl}
                    placement="bottom-end"
                    className="settings-popper"
                    transition disablePortal>
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin:'center bottom' }}
                    >
                        <div className="menu-settings">
                            <ClickAwayListener onClickAway={this.handleClose}>
                                <div className="list-menu-settings">
                                    {this.storeViewOptions ? (
                                        <React.Fragment>
                                            <div className="setting-label">
                                                {Identify.__('Language')}
                                            </div>
                                            {this.storeViewOptions}
                                        </React.Fragment>
                                    ) : ''}
                                    {this.currencyOptions ? (
                                        <React.Fragment>
                                            <div className="setting-label">
                                                {Identify.__('Currency')}
                                            </div>
                                            {this.currencyOptions}
                                        </React.Fragment>
                                    ) : ''}
                                </div>
                            </ClickAwayListener>
                        </div>
                    </Grow>
                )}
            </Popper>
        )
    }

    renderSettingTitle = () => {
        const storeConfig = Identify.getStoreConfig()
        this.storeName = ''
        try {
            if (storeConfig && this.storeViewOptions)
                this.storeName = <div className="store-name">{storeConfig.simiStoreConfig.config.base.store_name}</div>
        } catch (err) {
            console.warn(err)
        }

        this.currencyName = ''
        try {
            if (storeConfig && this.currencyOptions)
                this.currencyName = <div className="currency-name">{storeConfig.simiStoreConfig.config.base.currency_code}</div>
        } catch (err) {
            console.warn(err)
        }
        if (!this.currencyName && !this.storeName)
            return ''
        return (
            <div role="presentation" onClick={() => this.handleToggle()} className="settings-title">
                {this.storeName}
                { (this.currencyName && this.storeName) && <span className="settings-cur-sto-seperator"></span>}
                {this.currencyName}
                <i className="icon-chevron-down" />
            </div> 
        )
    }

    render() {
        const storeConfig = Identify.getStoreConfig()
        if (!storeConfig || !storeConfig.simiStoreConfig)
            return ''
        const settingOptions = this.renderSettingOptions()
        const settingTitle = this.renderSettingTitle()
        if (!settingTitle)
            return ''
        return (
            <div style={{position:'relative'}}
                ref={node => {
                    this.anchorEl = node;
                }}
                className="header-settings"
            >
                {this.renderSettingTitle()} 
                {settingOptions}
            </div>
        );
    }
}

export default Settings;