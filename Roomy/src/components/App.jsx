import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import Home from "./Home";
import Profile from './Profile';
import { useEffect } from "react";
import { getUserAuth } from "../action";
import { connect } from "react-redux";

function App(props) {
	useEffect(() => {
		props.getUserAuth();
	}, []);

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/">
						<Login />
					</Route>
					<Route path="/feed">
						{!props.user ? <Redirect to="/" /> :
							<span>
								<Header />
								<Home />
							</span>
						}
					</Route>
					<Route path="/profile/:id">
						<Profile />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const mapDispatchToProps = (dispatch) => ({
	getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
