import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { Whitebtn } from 'src/simi/BaseComponents/Button';
import { SwipeableRate } from 'src/simi/App/FashionTheme/BaseComponents/Rate';
import { showToastMessage } from 'src/simi/Helper/Message';
import { connect } from 'src/drivers';
import LoginModal from './loginModal';

require('./newReview.scss');
const $ = window.$;

const NewReview = props => {
    const { product, isSignedIn, firstname, lastname, onSubmitReview } = props;
    const { sku } = product;

    const storeConfig = Identify.getStoreConfig();
    const ratingForm = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config.rating_form || null;
    const allowGuestReview = storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config.catalog.review.hasOwnProperty('catalog_review_allow_guest') ? Number(storeConfig.simiStoreConfig.config.catalog.review.catalog_review_allow_guest) : 1;
    if (!ratingForm) return null;

    const handleSubmitReview = () => {
        const reviewForm = $('.review-form');
        const summary = reviewForm.find('#new-rv-title').val();
        const text = reviewForm.find('#new-rv-detail').val();
        if (!isSignedIn && !allowGuestReview) {
            showPopupLogin();
            return;
        }
        let nickname = lastname ? `${firstname} ${lastname}` : `${firstname}`;
        if (allowGuestReview && !isSignedIn) {
            nickname = $('#new-rv-nickname').val();
        }
        if (!nickname || !summary || !text) {
            showToastMessage(Identify.__('Please fill in all required fields'));
        } else {
            const starRate = reviewForm.find('.select-star');
            const ratings = [];
            for (let i = 0; i < starRate.length; i++) {
                const rate_key = $(starRate[i]).attr('data-key');
                const point = $(starRate[i]).attr('data-point');
                const objRateItem = {
                    id: btoa(rate_key),
                    value_id: btoa(point)
                }
                ratings.push(objRateItem);
            }
            const params = {
                sku,
                nickname,
                summary,
                text,
                ratings
            };
            onSubmitReview(params);
        }
    }

    const showPopupLogin = () => {
        if ($('#review-require-login-popup').length) {
            $('#review-require-login-popup').show();
        }
    }

    return (
        <div className="review-form">
            <p className="your-rating-title">{Identify.__('Your Review')}</p>
            <div className="rate-table">
                {ratingForm.map((item, index) => {
                    return (
                        <div className="rate-item" key={index}>
                            <div className="rate-cell label-item">{Identify.__(item.rate_code) + ':'}</div>
                            <div className="rate-cell stars-item" id={item.rate_code}><SwipeableRate rate={1} size={24} rate_option={item.rate_options} rate_code={item.rate_code} change={true} /></div>
                        </div>
                    );
                })}
            </div>
            <div className="form-content">
                {!isSignedIn && allowGuestReview ? <div className="form-group">
                    <p className="label-item">{Identify.__('Nickname')}<span className="rq">*</span></p>
                    <input type="text" id="new-rv-nickname" className="form-control" name="nickname" style={{ background: '#f2f2f2' }} required />
                </div> : ''}
                <div className="form-group">
                    <p className="label-item">{Identify.__('Your review title:')}<span className='rq'>*</span></p>
                    <input type="text" id="new-rv-title" className="form-control" name="title" style={{ background: '#f2f2f2' }} required placeholder={Identify.__('Please write your review title.')} />
                </div>
                <div className="form-group">
                    <p className="label-item">{Identify.__('Your review:')}<span className="rq">*</span></p>
                    <textarea id="new-rv-detail" name="detail" className='form-control' rows="10" style={{ background: '#f2f2f2' }} placeholder={Identify.__('Please write your review.')}></textarea>
                </div>
                <div className="btn-submit-review-ctn">
                    <Whitebtn
                        text={Identify.__('Submit')}
                        className="btn-submit-review"
                        onClick={handleSubmitReview}
                    />
                </div>
                {!isSignedIn && <LoginModal />}
            </div>
        </div>
    )
}

const mapStateToProps = ({ user }) => {
    const { currentUser } = user;
    const { firstname, lastname } = currentUser;

    return {
        firstname,
        lastname
    };
}


export default connect(mapStateToProps, null)(NewReview);
