import React from "react";
import Header from "./Misc/Header";
import Sidebar from "./Misc/Sidebar";
import { connect } from "react-redux";
import { getUserAuth } from "../action";
import { Redirect } from "react-router";
import RoommateFeed from "./Roommates/RoommateFeed";

function Roommates (props){
    return (
        <div className="Roommates">
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}
            <Header />
            <Sidebar />
            <RoommateFeed />
        </div>
    );
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
        loggingIn: state.userState.loggingIn,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Roommates);
