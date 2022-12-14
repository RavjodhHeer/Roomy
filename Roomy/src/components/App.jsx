import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './Login';
import Header from './Misc/Header';
import Sidebar from './Misc/Sidebar';
import Home from './Home';
import Profile from './Profile';
import Rentals from './Rentals';
import Roommates from './Roommates';
import SavedProperties from './SavedProperties';
import { getUserAuth } from '../action';
import Post from './Home/Post';

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
                    <Route path="/post/:id" component={Post} />
                    <Route path="/profile/:id" component={Profile} />
                    <Route path="/rentals" component={Rentals} />
                    <Route path="/roommates" component={Roommates} />
                    <Route path="/saved" component={SavedProperties} />
                </Switch>
            </Router>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
});

const mapDispatchToProps = (dispatch) => ({
    getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
