import React from 'react';
import Abstract from "./Abstract";
import Identify from "src/simi/Helper/Identify"
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OptionLabel from '../OptionLabel'
import {validateEmpty} from 'src/simi/Helper/Validation'
import TierPrices from '../../TierPrices'

class Select extends Abstract {
    constructor(props){
        super(props);
        const value = this.setDefaultSelected(0,false);
        this.state = {
            value
        };
    }

    componentDidMount(){
        if(this.state.value !== 0){
            this.updateForBundle(this.state.value,'select');
        }
    }

    validateField = (value) => {
        const {data, id} = this.props
        let error = ''
        
        if(data.required && !validateEmpty(value)) {
            error = Identify.__('This is a required field.')
        }

        $(`#error-option-${id}`).text(error)
    }   

    handleChange = (event) => {
        const value = event.target.value.toString();
        this.validateField(value)
        this.setState({ [event.target.name]: event.target.value });
        const key = this.key;
        if(value !== 0){
            this.updateSelected(key,value);
        }else{
            this.deleteSelected();
        }
        this.updateForBundle(value,'select');
    };

    renderWithBundle = (data) => {
        const { options } = data;
        const items = [];
        for (const i in options) {
            const item = options[i];
            const {product} = item || {}
            if(product.stock_status === 'IN_STOCK' && (product.type_id === 'simple' || product.type_id === 'virtual')) {
                const element = (
                    <MenuItem key={Identify.randomString(5)} name={this.props.key_field} value={Number(item.id)}>
                        <div className="option-row" style={{alignItems : 'center',fontFamily: 'Montserrat , sans-serif'}}>
                            {<OptionLabel title={item.product.name} type_id='bundle' item={item} style={{alignItems : 'center'}}/>}
                        </div>
                    </MenuItem>
                );
                items.push(element);
            }
        }
        return items;
    };

    renderWithCustom = (data) => {
        let values = [];
        if (data.hasOwnProperty('dropdown_value')) {
            values = data.dropdown_value;
        }
        if(values instanceof Array && values.length > 0){
            const items = values.map(item => {
                return (
                    <MenuItem key={Identify.randomString(5)} value={item.option_type_id}>
                        <div className="option-row" style={{alignItems : 'center'}}>
                            {<OptionLabel title={item.title} item={item} style={{alignItems : 'center'}}/>}
                        </div>
                    </MenuItem>
                );

            });
            return items;
        }
        return <div></div>
    };

    renderTierPrices(data) {
        const {parent, id} = this.props
        const {options} = data
        const selected = parent.selected;
        if(options && selected && selected[id]) {
            const currentOption = options.find(option => option.id === Number(selected[id]))
            if (
                currentOption 
                && currentOption.product 
                && currentOption.product.price_tiers
                && currentOption.product.price_range 
            ) {
                return <TierPrices price_tiers={currentOption.product.price_tiers} priceObj={currentOption.product.price_range}/>
            }

            return null
        }

        return null
    }

    render = () => {
        const {data} = this.props;
        const {error} = this.state;
        const type_id = this.props.parent.getProductType();
        let items = null;
        if(type_id === 'bundle'){
            items = this.renderWithBundle(data);
        }else {
            items = this.renderWithCustom(data)
        }
        return (
            <div className="option-value-item-select">
                <FormControl  style={{color : '#333',marginTop:20}} fullWidth={true}>
                    <SelectField
                        value={this.state.value}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'value',
                            id: 'selection',
                        }}
                    >
                        <MenuItem key={Identify.randomString(5)} value={0}>
                            <div className="option-row" style={{alignItems : 'center',fontSize:16,fontWeight:100}}>
                                <em>{Identify.__('Choose a selection')}</em>
                            </div>
                        </MenuItem>
                        {items}
                    </SelectField>
                </FormControl>
                {type_id === 'bundle' && this.renderTierPrices(data)}
            </div>

        );
    }
}

export default Select;
