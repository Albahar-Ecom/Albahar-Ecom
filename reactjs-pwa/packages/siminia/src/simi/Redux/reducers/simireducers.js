import { handleActions } from 'redux-actions';

import simiActions from 'src/simi/Redux/actions/simiactions';


const initialState = {
    simiValue: 'cody_initialize_value',
    storeConfig: null,
    simiMessages: [],// [{type: 'success', message: 'sample', auto_dismiss: true}]
    simiNProgressLoading: false
};

const reducerMap = {
    [simiActions.changeSampleValue]: (state, { payload }) => {
        return {
            ...state,
            simiValue: payload
        };
    },
    [simiActions.setStoreConfig]: (state, { payload }) => {
        return {
            ...state,
            storeConfig: payload
        };
    },
    [simiActions.toggleMessages]: (state, { payload }) => {
        return {
            ...state,
            simiMessages: payload
        };
    },
    [simiActions.setSimiNProgressLoading]: (state, { payload }) => {
        return {
            ...state,
            simiNProgressLoading: payload
        };
    }
};

export default handleActions(reducerMap, initialState);
