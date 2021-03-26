import { useMemo } from 'react';
import { simiUseQuery as useQuery/* , simiUseLazyQuery as useLazyQuery */ } from 'src/simi/Network/Query';
import { useWindowSize } from '@magento/peregrine';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product';

export const useLinkedProducts = props => {

    const {
        skuValues,
        maxItem,
        query: { getProductBySku }
    } = props;

    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const variables = {
        stringSku: skuValues,
        currentPage: 1,
        pageSize: maxItem
    };

    const { data: dataProducts, error: productsError, loading } = useQuery(
        getProductBySku, { fetchPolicy: 'cache-and-network', variables }
    );

    const initialData = useMemo(() => {
        if (dataProducts) {
            let modedData = JSON.parse(JSON.stringify(dataProducts))
            modedData.products = applySimiProductListItemExtraField(modedData.simiproducts);
            return modedData
        }
        return dataProducts;
    }, [dataProducts]);

    return {
        isPhone,
        initialData,
        loading,
        productsError
    };
}
