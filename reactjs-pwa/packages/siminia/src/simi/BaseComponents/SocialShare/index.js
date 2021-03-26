import React from 'react';
import PropTypes from 'prop-types';

const $ = window.$
class SocialShare extends React.PureComponent {
    componentDidMount() {
        let url = this.props.sharingUrl ? this.props.sharingUrl : document.URL
        if (url.indexOf('?id') === -1 && this.props.id) {
            url = url + '?id=' + this.props.id;
        }
        $(function () {
            const social = $('#social-share');
            social.attr('data-url', url);
            $('.social-share').html(social.clone());
            const btn = $('.social-share .at-share-btn-elements').children('a');
            btn.each(function () {
                $(this).click(function () {
                    let a = $(this).attr('class');
                    let d = social.find('a').hasClass(a);
                    if (d) {
                        let aSplit = a.split(/\s+/);
                        let aJoin = aSplit.join('.');
                        let socialF = social.find(`a.${aJoin}`);
                        socialF[0].click();
                    }
                });
            });
        });
    }
    renderJS() {
        $.ajax({
            method: "GET",
            cache: false,
            url: "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5a4f1df88e0b979a",
            dataType: "script"
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="social-share"></div>
                <div className="social-script"></div>
                {this.renderJS()}
            </div>
        )
    }
}

SocialShare.propTypes = {
    className: PropTypes.string
}

SocialShare.defaultProps = {
    className: ''
}

export default SocialShare;
