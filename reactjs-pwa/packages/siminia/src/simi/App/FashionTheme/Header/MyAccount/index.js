import React from 'react';
import User from 'src/simi/App/FashionTheme/BaseComponents/Icon/User';
import Identify from 'src/simi/Helper/Identify';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import { connect } from 'src/drivers';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { logout as signOutApi } from 'src/simi/Model/Customer';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import {showToastMessage} from 'src/simi/Helper/Message';

class MyAccount extends React.Component {
	state = {
		open: false
	};

	handleLink(link) {
		this.props.history.push(link);
	}

	handleToggle = () => {
		this.setState((state) => ({ open: !state.open }));
	};

	handleClose = (event) => {
		if (this.anchorEl.contains(event.target)) {
			return;
		}

		this.setState({ open: false });
	};

	handleClickItem = (link) => {
		this.handleLink(link);
		this.handleToggle();
	};

	executeLogout = () => {
		// Hide menu
		this.handleToggle();
		// Call api logout from backend
		signOutApi(this.signOutCallback.bind(this), {});
		showFogLoading();
	};

	signOutCallback = (data) => {
		hideFogLoading();
		if (data.errors) {
			let errorMsg = '';
			if (data.errors.length) {
				data.errors.map((error) => {
					errorMsg += error.message;
				});
				showToastMessage(Identify.__(errorMsg));
			}
		} else {
			// Redirect to page logout pwa
			this.handleLink('/logout.html');
		}
	};

	renderMyAccount = () => {
		const { open } = this.state;
		return (
            <Popper open={open} anchorEl={this.anchorEl} placement="bottom-end"
                className="myaccount-popper" transition disablePortal>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} id="menu-list-grow" style={{ transformOrigin: 'center bottom' }}>
						<div className='menu-my-account'>
							<ClickAwayListener onClickAway={this.handleClose}>
								<div className='list-menu-account'>
									<MenuItem
										className='my-account-item'
										onClick={() => this.handleClickItem('/account.html')}
									>
										{Identify.__('My Account')}
									</MenuItem>
									<MenuItem
										className='my-account-item'
										onClick={() => this.handleClickItem('/wishlist.html')}
									>
										{Identify.__('My Wishlist')}
									</MenuItem>
									<MenuItem
                                        className='my-account-item'
                                        onClick={() => this.handleClickItem('/logout.html')}
									>
										{Identify.__('Logout')}
									</MenuItem>
								</div>
							</ClickAwayListener>
						</div>
					</Grow>
				)}
			</Popper>
		);
	};

	render() {
		const { props } = this;
        const { firstname, isSignedIn } = props;
		const account = firstname ? <span className='customer-firstname'>{firstname}</span> : null;
		return (
			<div
				style={{ position: 'relative' }}
				ref={(node) => {
					this.anchorEl = node;
				}}
			>
                <div role="presentation"
                    onClick={() =>
                        {
                            if(isSignedIn)
                                this.handleToggle()
                            else
                                this.handleLink('/login.html')
                        }
                    }>
                    {
                        account ? account:
                        <div className='item-icon' style={{ display: 'flex', justifyContent: 'center' }}>
                            <User />
                        </div>
                    }
				</div>
				{isSignedIn && this.renderMyAccount()}
			</div>
		);
	}
}

const mapStateToProps = ({ user }) => {
	const { currentUser, isSignedIn } = user;
	const { firstname, lastname } = currentUser;

	return {
		firstname,
		isSignedIn,
        lastname,
        user
	};
};

export default compose(connect(mapStateToProps), withRouter)(MyAccount);
