import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import Store from '../store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { signInWithEmail, signOutAPI } from '../action';

const serverURL = 'https://server-5te64e4pdq-uw.a.run.app';

test('Logging in should populate user info', async () => {
    await signInWithEmail('donkeyfromshrek@outlook.com','password');
    const states = Store.getState();
    const userState = states.userState;
    expect(userState).toHaveProperty('user');
});

test('Logging out should remove user info locally', async () => {
    await signInWithEmail('donkeyfromshrek@outlook.com','password');
    await signOutAPI();
    const states = Store.getState();
    const userState = states.userState;
    expect(userState.user).toEqual(null);
});

test('\'Get roommates\' request, should return back 200 status code', async () => {
    const data = new FormData();
    const response = await fetch(`${serverURL}/get_roommates`, {
        mode: 'cors', // no-cors, *cors, same-origin
        method: 'GET',
    });
    expect(response.status).toEqual(200);
});

test('\'Get rentals\' request, should return back 200 status code', async () => {
    const data = new FormData();
    const response = await fetch(`${serverURL}/get_rentals`, {
        mode: 'cors', // no-cors, *cors, same-origin
        method: 'GET',
    });
    expect(response.status).toEqual(200);
});

test('Get non-existent article request, should return back 200 status code since front-end deals with empty values', async () => {
    const data = new FormData();
    data.append('pid', 100);
    const response = await fetch(`${serverURL}/get_single_article`, {
        mode: 'cors', // no-cors, *cors, same-origin
        method: 'POST',
        body:data,
    });
    expect(response.status).toEqual(200);
});