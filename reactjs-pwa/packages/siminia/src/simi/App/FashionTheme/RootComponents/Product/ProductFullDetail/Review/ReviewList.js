import React from 'react';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import QUERY_PRODUCT_REVIEWS from 'src/simi/queries/catalog/getProductReview';
import CREATE_PRODUCT_REVIEW from 'src/simi/queries/catalog/createProductReview';
import { useReviewList } from 'src/simi/talons/Review/useReviewList';
import { showToastMessage } from 'src/simi/Helper/Message';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { connect } from 'src/drivers';
import Pagination from './Pagination';
import NewReview from './NewReview';
require('./reviewList.scss');

const ReviewList = (props) => {
    const { sku, rate, review_count, product, toggleMessages } = props;

    const ITEMS_PER_PAGE = 2;

    const talonProps = useReviewList({
        sku,
        itemsPerPage: ITEMS_PER_PAGE,
        queries: { getProductReview: QUERY_PRODUCT_REVIEWS },
        mutation: { createProductReview: CREATE_PRODUCT_REVIEW }
    });

    const { dataReview, derivedErrorMessage, loading,
        loadMoreReview, currentPage, submitReview,
        isSignedIn, isSubmittedReview } = talonProps;

    if (derivedErrorMessage) {
        showToastMessage(derivedErrorMessage);
    }

    if (isSubmittedReview) {
        toggleMessages([{ type: 'success', message: Identify.__('Your review has been accepted for moderation.'), auto_dismiss: true }]);
    }

    if (loading && !dataReview) return <Loading />;

    const newReviewHtml = (<div className="new-review" id="product-detail-new-review">
        <NewReview product={product} onSubmitReview={submitReview} isSignedIn={isSignedIn} />
    </div>);

    const reviewEmpty = (<React.Fragment>
        <div className="review-list">
            <div className="text-center">{Identify.__('Review is empty')}</div>
        </div>
        {newReviewHtml}
    </React.Fragment>);

    if (!dataReview || !dataReview.productDetail || !dataReview.productDetail.items.length) {
        return reviewEmpty;
    }

    const productItem = dataReview.productDetail.items;
    const { items } = productItem[0].reviews;
    if (!items || !items.length) return reviewEmpty;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const listReview = items.map((review, idx) => {
        const createdAt = Identify.formatDate(review.created_at);

        return <div className="review-item item" key={idx}>
            <div className="item-title flex">{review.summary}</div>
            <div className="item-detail">{review.text}</div>
            <div className="review-item-detail">
                <div className="item-created flex" style={{ marginLeft: Identify.isRtl() ? 0 : 'auto', marginRight: Identify.isRtl() ? 'auto' : 0 }} >
                    <span>{`${createdAt.getDate()} ${monthNames[createdAt.getMonth()]} ${createdAt.getFullYear()}`}</span>
                    <span>{review.nickname}</span>
                </div>
                <div className="item-rate">
                    <StaticRate rate={review.average_rating} size={14} width={90} isRtl={Identify.isRtl()} />
                </div>
            </div>
        </div>
    });

    const listAllReviews = () => {
        return <div className="list-review-item">
            {listReview}
            {items && (items.length < review_count) ? <Pagination loading={loading} currentPage={currentPage} loadMoreReview={loadMoreReview} /> : ''}
        </div>
    }

    return <React.Fragment>
        <div className="review-list">
            <h2 className="review-list-title">
                <span>{review_count + ' ' + Identify.__(`Customer Reviews`)}</span>
            </h2>
            <div className="total-rate">
                <StaticRate rate={rate} size={24} width={137} isRtl={Identify.isRtl()} />
                <p>{Identify.__(`This has a rating of ${review_count}/5`)}</p>
            </div>
            {listAllReviews()}
        </div>
        {newReviewHtml}
    </React.Fragment>
}


const mapDispatchToProps = {
    toggleMessages
};


export default connect(null, mapDispatchToProps)(ReviewList);
