import React, { Component } from 'react';
import { connect } from 'src/drivers';
import PropTypes from 'prop-types';
import { toggleDrawer } from 'src/actions/app';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        openNav: PropTypes.func.isRequired
    };

    render() {
        const { children, openNav } = this.props;

        return (
            <div
                role="presentation"
                onClick={openNav}
            >
                {children}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openNav: () => dispatch(toggleDrawer('nav'))
});

export default connect(
    null,
    mapDispatchToProps
)(Trigger);
