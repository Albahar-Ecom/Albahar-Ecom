import React from 'react';
import Abstract from './Abstract';
import {configColor} from "src/simi/Config";
import Identify from 'src/simi/Helper/Identify';
import {formatPrice} from "src/simi/Helper/Pricing";
import CheckIcon from '@material-ui/icons/Check'

class Label extends Abstract{

    handleSelect =(e,item)=>{

        const element = '#label-'+item.id;
        if($(element).children('.option-label').hasClass('disable')) return; // disable layout
        const classLabel = '.option-label-'+this.key;
        $(classLabel).each(function () {
            if($(this).hasClass('selected')){
                if($(this).hasClass('text')){
                    $(this).css({
                        color : '#000',
                        background : '#f2f2f2'
                    });
                }
                $(this).removeClass('selected');
            }
        });

        // color swatch
        if(item.type === 'color' && item.hasOwnProperty('base_image') && item.base_image){
            this.handleColorSwatch(item.base_image)
        }
        if(Identify.magentoPlatform() === 2 && item.type === 'color'){
            const id = item.products[0]
            const images = this.parent.data.configurable_options.images[id][0];
            if(images.hasOwnProperty('img') && images.img){
                this.handleColorSwatch(images.img)
            }
        }

        const value = item.id;
        $(element).children('.option-label').toggleClass('selected');
        const selected = $(element).children('.option-label').hasClass('selected');

        if(selected){
            // change background label seleted
            $(element).children('.option-label.text').css({
                color : configColor.button_text_color,
                background : configColor.button_background
            });
            
            const attr_label = 'span#additions-'+this.key+'-label';
            $(attr_label).html(item.label); // show label selected

            // show price label
            if(Identify.magentoPlatform() === 1){
                const price = this.showLabelPrice(item);
                const attr_price = 'span#additions-'+this.key+'-price';
                $(attr_price).html('+ ' + price);
            }

            // handle active label
            const currentLabelClass = 'option-label-'+this.key;
            const currentProducts = $(element).children('.option-label').attr('data-product').split(',');
            $('.option-label').each(function () {
                if(!$(this).hasClass(currentLabelClass)){
                    const products = $(this).attr('data-product').split(',');
                    const aProducts = currentProducts.filter(function (obj) {
                        return products.indexOf(obj) !== -1;
                    });
                    if (aProducts.length > 0) {
                        $(this).addClass('active');
                        $(this).removeClass('disable');
                    }else{
                        $(this).removeClass('active');
                        $(this).addClass('disable');
                    }
                }
            });
            this.updateSelected(this.key,value);
        }else{
            this.deleteSelected()
        }
    };
    
    showLabelPrice=(item)=>{
        if (Identify.magentoPlatform() === 1){
            const taxConfig = this.props.taxConfig;
            let price = item.price;
            let inclT = 0;
            let exclT = 0;
            if (taxConfig.includeTax) {
                if (price !== 0) {
                    const tax = parseFloat(price / (100 + taxConfig.defaultTax) * taxConfig.defaultTax);
                    const excl = parseFloat(price - tax);
                    const incl = parseFloat(excl * (1 + (taxConfig.currentTax / 100)));
                    exclT = excl;
                    inclT = incl;
                }
            } else {
                if (price !== 0) {
                    const tax = parseFloat(price * (taxConfig.currentTax / 100));
                    const excl = parseFloat(price);
                    const incl = parseFloat(excl + tax);
                    inclT = incl;
                    exclT = excl;
                }
            }

            if (taxConfig.showIncludeTax === true) {
                //set price when choosing
                price = inclT;

            } else if (taxConfig.showBothPrices === true) {
                // prices.regural_price += inclT;
                price = inclT;
            } else {
                price = exclT;
            }
            return formatPrice(price);
        }
    };

    handleColorSwatch = (img) => {
        const el = $('ul.thumbs li.thumb img').first();
        el.click();
        el.attr('src',img)
        $('ul.slider li.slide img').first().attr('src',img)
    }

    handleImgName = (str)=>{
        const index = str.lastIndexOf('/');
        return str.substr(index);
    }

    renderLabel =(item=this.props.data)=>{
        const style = {
            display : 'inline-block',
            marginRight : '10px',
            cursor : 'pointer',
            position : 'relative'
        };
        const imgStyle = {
            width : '35px',
            height : '35px'
        };
        const classValue = 'option-label-'+this.props.id;
        const product = item.products.valueOf();
        let label = (
            <div data-product={product} className={`option-label ${classValue} text `}
                 style={{
                ...style,
                ...{
                    width : 'auto',
                    height : '41px',
                    background : '#f2f2f2',
                    fontWeight : 600
                }
                 }}
            >
                <p style={{
                    fontSize : '15px',
                    paddingTop : '8px',
                    margin : 0,
                    overflow: 'hidden'
                }}>{item.label}</p>
                <div className="label-line">
                    <div className="line"></div>
                </div>
            </div>
        );
        if (item.option_image) {
            const base_img = item.hasOwnProperty('base_image') && item.base_image ?
                <img className='hidden' src={item.base_image} alt={item.base_image}/> : null;
            label = (
                <div data-product={product} className={`option-label' ${classValue}`} style={style} >
                    <img style={imgStyle} src={item.option_image} alt={item.label}/>
                    {base_img}
                    <div className="label-line">
                        <div className="line"></div>
                    </div>
                    <div className="label-check-selected">
                        <CheckIcon style={{fill:'#fff'}}/>
                    </div>
                </div>
            );
        }else if(item.type === 'color'){
            if(this.colourNameToHex(item.label)){
                label = (
                    <div data-product={product} className={`option-label ${classValue}`}
                         style={{
                             ...style,
                             ...{
                                 width : 'auto',
                                 height : '41px',
                                 background : this.colourNameToHex(item.label) ? this.colourNameToHex(item.label) : '#f2f2f2' ,
                                 fontWeight : 600
                             }
                         }}
                    >
                        <div className="label-line">
                            <div className="line"/>
                        </div>
                        <div className="label-check-selected">
                            <CheckIcon style={{fill:'#fff'}}/>
                        </div>
                    </div>
                );
            }

        }

        return <div role="presentation" id={`label-${item.id}`} onClick={(e)=>this.handleSelect(e,item)}>{label}</div>
    };

    render(){
        return this.renderLabel();
    }

    colourNameToHex = (colour) =>
    {
        const colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
            "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
            "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
            "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
            "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
            "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
            "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
            "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
            "honeydew":"#f0fff0","hotpink":"#ff69b4",
            "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
            "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
            "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
            "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
            "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
            "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
            "navajowhite":"#ffdead","navy":"#000080",
            "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
            "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
            "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
            "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
            "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
            "violet":"#ee82ee",
            "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
            "yellow":"#ffff00","yellowgreen":"#9acd32"};

        if (typeof colours[colour.toLowerCase()] !== 'undefined')
            return colours[colour.toLowerCase()];

        return false;
    }

}
export default Label;