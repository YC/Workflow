import axios from 'axios';
import { apiURL } from './connection';
// Import actions from action types
import {
    ADD_MEMBER,
    USER_LOGOUT,
    SET_USER_REDEEMED,
    ADD_USER_REDEEM,
    REDUCE_USER_REP,
    AUTHENTICATED,
    AUTHENTICATION_ERROR,
    REGISTER_USER,
    SET_STATUS
} from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Handles user registration
export const userRegister = userInfo => async dispatch => {
    try {
        // Send user registration request
        let res = await axios.post(
            `${apiURL}/user/register`,
            {
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                username: userInfo.username,
                password: userInfo.password,
                email: userInfo.email,
                type: userInfo.type
            },
            { withCredentials: true }
        );

        // Add result to store
        return dispatch({
            type: REGISTER_USER,
            user: res.data,
            status: 'success'
        });
    } catch (err) {
        // If user could not be registered, update state such that an error
        // message will be displayed
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};

// -----------------------------------------------------------------------
// Handles user login
export const userLogin = (username, password) => async dispatch => {
    try {
        // Send login request
        let res = await axios.post(
            `${apiURL}/user/login`,
            {
                username,
                password
            },
            { withCredentials: true }
        );
        const user = res.data;

        // Add the user as a member
        dispatch({
            type: ADD_MEMBER,
            member: user,
            memberID: user.id
        });
        // Set user by triggering state change
        return dispatch({
            type: AUTHENTICATED,
            user,
            status: 'success'
        });
    } catch (err) {
        // Otherwise, login failed and an error message should be displayed
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};

// -----------------------------------------------------------------------
// Handles session recovery
export const recoverSession = () => async dispatch => {
    // Attempt to recover session
    try {
        // Send session recovery request (GET request for session)
        let res = await axios.get(`${apiURL}/user/session`, {
            withCredentials: true
        });
        const user = res.data;

        // Add the user as a member
        dispatch({
            type: ADD_MEMBER,
            member: user,
            memberID: user.id
        });
        // Set the user
        return dispatch({
            type: AUTHENTICATED,
            user,
            status: 'success'
        });
    } catch (err) {
        // Otherwise, session recovery failed and the login page
        // should be displayed
        return dispatch({
            type: AUTHENTICATION_ERROR,
            status: 'failure'
        });
    }
};

// -----------------------------------------------------------------------
// Handles user logout
export const userLogout = () => async dispatch => {
    try {
        // Ask for logout
        await axios.get(`${apiURL}/user/logout`, { withCredentials: true });
        // Reset store
        return dispatch({ type: USER_LOGOUT });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};

// -----------------------------------------------------------------------
// Retrieves the redeemed items of the user
export const getRedeemed = () => async dispatch => {
    try {
        // Retrieve the redeemed items of the user from API
        const res = await axios.get(`${apiURL}/user/redeems`, {
            withCredentials: true
        });

        // Attach the items to the user
        return dispatch({
            type: SET_USER_REDEEMED,
            redeemed: res.data.redeemItems
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};

// -----------------------------------------------------------------------
// Redeems an item for the current user
export const addRedeem = redeem => async (dispatch, getState) => {
    try {
        // Redeem item
        let res = await axios.post(`${apiURL}/user/redeem`, redeem, {
            withCredentials: true
        });

        // Reduce user rep
        dispatch({
            type: REDUCE_USER_REP,
            rep: getState().redeemables[redeem.redeemableID].rep
        });
        // Attach redeemed item to user (in store)
        return dispatch({ type: ADD_USER_REDEEM, redeem: res.data });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
