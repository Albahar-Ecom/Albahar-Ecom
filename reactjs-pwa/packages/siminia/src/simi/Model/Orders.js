import { sendRequest } from 'src/simi/Network/RestMagento';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

//by increment id
export const getOrderDetail = (id,callBack) => {
    sendRequest(`/rest/V1/simiconnector/orders/${id}`, callBack)
}

export const getReOrder = (id, callBack) => {
    const params = { reorder : 1 }
    const cartId = storage.getItem('cartId');
    if (cartId)
        params.quote_id = cartId
    sendRequest(`/rest/V1/simiconnector/orders/${id}`,callBack, 'GET', params)
}


export const getOrderDetailByEntityId = (id,callBack) => {
    sendRequest(`/rest/V1/simiconnector/orders/${id}?by_entity_id=1`, callBack)
}
