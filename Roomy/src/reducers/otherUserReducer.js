import { SET_OTHER_USER } from "../action/actionType";

const INITIAL_STATE = {
	otherUser: null,
};

const otherUserReducer = (state = INITIAL_STATE, action) => {
	console.log("Logging in")
	switch (action.type) {
		case SET_OTHER_USER:
			return {
				...state,
				otherUser: action.otherUser,
			};
		default:
			return state;
	}
};

export default otherUserReducer;
