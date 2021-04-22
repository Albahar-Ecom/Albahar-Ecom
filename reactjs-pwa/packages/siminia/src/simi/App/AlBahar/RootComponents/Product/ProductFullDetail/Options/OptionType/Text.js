import React from 'react';
import Abstract from './Abstract';
import Identify from 'src/simi/Helper/Identify';
import {validateEmpty} from 'src/simi/Helper/Validation'

class Text extends Abstract {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    state = {
        value: ''
    };

    validateField = (value) => {
        const {data, configField, id} = this.props
        let error = ''
        
        if(data.required && !validateEmpty(value)) {
            error = Identify.__('This is a required field.')
        }

        if(value && (Number(configField.max_characters) > 0 && value.length > Number(configField.max_characters))) {
            error = Identify.__(`Please enter no more than %s characters.`).replace('%s', Number(configField.max_characters))
        }

        $(`#error-option-${id}`).text(error)
    }   

    handleChange = (event) => {
        const value = event.target.value
        this.validateField(value)

        this.setState({
            value: value
        });

        if(value){
            this.updateSelected(this.key,value);
        }else{
            this.deleteSelected(this.key);
        }
    };

    renderTextField = ()=>{
        const {id} = this.props
        return(
            <div className={`option-text-field`}>
                <input
                    id="text-field"
                    name={`option[${id}]`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    // onBlur={this.handleChange}
                    className="form-control"
                    style={{
                        width : '100%',
                        background : '#f2f2f2',
                        border : 'none',
                        boxShadow : 'none'
                    }}
                />
            </div>
        )
    };

    renderTextArea =()=>{
        const {id} = this.props
        console.log(this.state.value)
        return (
            <div className={`form-group`}>
                <textarea 
                    name={`option[${id}]`}
                    id="option-text-area"  
                    className="form-control" rows="5" style={{
                    background : '#f2f2f2',
                    border : 'none',
                    boxShadow : 'none'}} 
                    onChange={this.handleChange}
                    // onBlur={this.handleChange}
                />
            </div>
        )
    }

    render(){
        console.log(this.props)
        const {configField, type} = this.props
        let content = this.renderTextField()
        if(type === 'area') {
            content = this.renderTextArea()
        }
        return (
            <div>
                {content}
                {configField.max_characters > 0 && <p>{Identify.__('Maximum number of characters:')} {configField.max_characters}</p>}
            </div>
        )
    }
}
export default Text;