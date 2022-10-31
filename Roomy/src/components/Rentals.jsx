import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUserAuth } from "../action";
import { Redirect } from "react-router";
import RentalPostalModal from "./Rentals/RentalPostalModal";

const Container = styled.div`
	grid-area: main;
`;

const CommonBox = styled.div`
	top 50px;
	text-align: center;
	overflow: hidden;
	margin-bottom: 8px;
	background-color: #fff;
	border-radius: 2px;
	position: relative;
	border: none;
	box-shadow: 0 0 5px #999, 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonBox)`
	display: flex;
	flex-direction: column;
	margin: 0 0 8px;
	color: #958b7b;
	div {
		button {
			outline: none;
			color: rgba(0, 0, 0, 0.6);
			font-size: 14px;
			line-height: 1.5;
			min-height: 48px;
			display: flex;
			align-items: center;
			border: none;
			background-color: transparent;
			font-weight: 600;
		}
		&:first-child {
			display: flex;
			align-items: center;
			padding: 8px 16px;
			img {
				width: 48px;
				border-radius: 50%;
				margin-right: 8px;
			}
			button {
				margin: 4px 0;
				flex-grow: 1;
				padding-left: 16px;
				border: 1px solid rgba(0, 0, 0, 0.15);
				border-radius: 35px;
				text-align: left;
			}
		}
		&:nth-child(2) {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			padding-bottom: 4px;
			button {
				img {
					margin: 0 4px 0 -2px;
				}
			}
		}
	}
`;

const Content = styled.div`
	text-align: center;
	& > img {
		width: 30px;
	}
`;


function Rentals (props){
    return (
        <div className="Rentals">
            {(!props.user && !props.loggingIn) && <Redirect to="/" />}
            <Header />
            <Sidebar />
			<div>
                <h1> Profile UID: {props.user ? props.user.uid : "ok"} </h1>
				<RentalPostalModal showModal={"open"}/>
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
