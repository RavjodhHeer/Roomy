import { SET_USER } from '../action/actionType';

const INITIAL_STATE = {
    user: null,
    loggingIn: true,
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
    case SET_USER:
        return {
            ...state,
            user: action.user,
            loggingIn: false,
        };
    default:
        return state;
    }
};

export default userReducer;
