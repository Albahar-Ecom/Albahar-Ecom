import React from 'react';
import PropTypes from 'prop-types';
import BundlePrice from './Bundle';
import Simple from './Simple';
import Grouped from './Grouped';

class PriceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.type;
    }

    renderView() {
        this.prices = this.props.prices;
        const { classes } = this.props;

        if (this.type === "bundle") {
            return <BundlePrice prices={this.prices} parent={this} classes={classes} />
        }
        else if (this.type === "grouped") {
            // for list page group product
            return <Grouped prices={this.prices} parent={this} classes={classes} />
        }
        else {
            ////simple, configurable ....
            return <Simple prices={this.prices} parent={this} classes={classes} />
        }
    }

    render() {
        const { props } = this;
        const classes = props.clasess ? props.clasess : {};
        return (
            <div className={`price-${this.type} ${classes[`price-${this.type}`]}`}>{this.renderView()}</div>
        );
    }
}
PriceComponent.defaultProps = {
    prices: 0,
    type: 'simple',
    stylePrice: {},
    styleSpecialPrice: {},
    classes: {},
};
PriceComponent.propTypes = {
    type: PropTypes.string,
    stylePrice: PropTypes.object,
    styleSpecialPrice: PropTypes.object,
    classes: PropTypes.object,
};
export default PriceComponent;
