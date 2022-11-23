import { SET_LOADING_STATUS, GET_ROOMMATES } from '../action/actionType';

export const initialState = {
    loading: false,
    articles: [],
};

function roommateReducer(state = initialState, action) {
    switch (action.type) {
    case GET_ROOMMATES:
        return {
            ...state,
            roommates: action.payload,
            ids: action.id,
        };
    case SET_LOADING_STATUS:
        return {
            ...state,
            loading: action.status,
        };
    default:
        return state;
    }
}

export default roommateReducer;
