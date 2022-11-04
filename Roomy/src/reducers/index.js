import { combineReducers } from "redux";
import userReducer from "./userReducer";
import articleReducer from "./articleReducer";
import rentalReducer from "./rentalReducer";
import otherUserReducer from "./otherUserReducer";

const rootReducer = combineReducers({
	userState: userReducer,
	articleState: articleReducer,
	rentalState: rentalReducer,
	otherUserState: otherUserReducer,
});

export default rootReducer;
