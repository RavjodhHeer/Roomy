import { render, fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import Store from '../store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { signInWithEmail, signOutAPI } from '../action';

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

