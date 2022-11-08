import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Profile from './Profile';
import Rentals from './Rentals';
import Roommates from './Roommates';
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
						<span>
							<Header />
							<Sidebar />
							<Home />
						</span>
					</Route>
					<Route path="/profile/:id" component={Profile}/>
					<Route path="/rentals" component={Rentals}/>
					<Route path="/roommates" component={Roommates}/>
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
