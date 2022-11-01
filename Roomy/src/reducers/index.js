import { combineReducers } from "redux";
import userReducer from "./userReducer";
import articleReducer from "./articleReducer";
import rentalReducer from "./rentalReducer";

const rootReducer = combineReducers({
	userState: userReducer,
	articleState: articleReducer,
	rentalState: rentalReducer,
});

export default rootReducer;
