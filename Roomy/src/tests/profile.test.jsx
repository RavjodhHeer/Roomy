import { render, fireEvent, screen } from "@testing-library/react";
import * as React from 'react';
import Store from "../store";
import { Provider, connect } from "react-redux";
import '@testing-library/jest-dom';
import { signInWithEmail } from "../action";
import Profile from "../components/Profile";
import {Route, MemoryRouter} from 'react-router-dom';

const mapStateToProps = (state) => {
	return {
		user: state.userState.user,
	};
};

const ProfileElem = connect(mapStateToProps)(Profile);

test("Profile page should show correct user's info", async (done) => {
    signInWithEmail("donkeyfromshrek@outlook.com","password");
    setTimeout(()=>{
        render(
            <Provider store={Store}>
                <MemoryRouter initialEntries={['profile/H2RXZqfLqBQZ5c1Xy5DZjXsKiT03']}>
                    <Route path='profile/:id'>
                        <ProfileElem />
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        done();
    }, 3000);

    setTimeout(()=>{
        const name = screen.getByTestId("name");
        expect(name).toEqual("Donkey From Shrek");
        done();
    }, 3000);
});
