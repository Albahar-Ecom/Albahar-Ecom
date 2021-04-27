import React, { useMemo, useCallback } from 'react';
import { string, shape, array } from 'prop-types';
import { connect } from 'src/drivers';
import { GridItem } from 'src/simi/App/AlBahar/BaseComponents/GridItem';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';

require('./gallery.scss');

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const Gallery = props => {
    const { items, history, setSimiNProgressLoading } = props;

    const handleLink = useCallback((link) => {
        setSimiNProgressLoading(true);
        history.push(link);
    }, []);

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GridItem key={index} />;
                }
                return <GridItem key={index} item={mapGalleryItem(item)} handleLink={handleLink} />;
            }), [items]
    );

    return (<div className="gallery-root">
        <div className="gallery-items">
            {galleryItems}
        </div>
    </div>)
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    items: array.isRequired
};

const mapDispatchToProps = {
    setSimiNProgressLoading
};

export default connect(null, mapDispatchToProps)(Gallery);
