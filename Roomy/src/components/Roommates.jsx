import React, {useState} from "react";
import Header from "./Misc/Header";
import Sidebar from "./Misc/Sidebar";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth } from "../action";
import { Redirect } from "react-router";
import RoommateFeed from "./Roommates/RoommateFeed";
import RoommatePostalModal from "./Roommates/RoommatePostalModal";

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
