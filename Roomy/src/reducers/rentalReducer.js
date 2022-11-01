import { SET_LOADING_STATUS, GET_RENTALS } from "../action/actionType";

export const initialState = {
	loading: false,
	articles: [],
};

function rentalReducer(state = initialState, action) {
	switch (action.type) {
		case GET_RENTALS:
			return {
				...state,
				rentals: action.payload,
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

export default rentalReducer;
