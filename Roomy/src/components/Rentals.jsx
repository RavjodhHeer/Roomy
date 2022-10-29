import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth } from "../action";
import { Redirect } from "react-router";

function Rentals (props){
    return (
        <div className="Rentals">
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}
            <Header />
            <Sidebar />
            <div>
                <h1> Profile UID: {props.user ? props.user.uid : "ok"} </h1>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Rentals);