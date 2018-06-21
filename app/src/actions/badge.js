import axios from 'axios';
import { apiURL } from './connection';
// Import constants from action types
import { SET_BADGES, SET_STATUS } from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Retrieves specific badges
export const getBadges = badgeIDs => async dispatch => {
    // Join the IDs of the badges together to condense request
    const badgeIDString = badgeIDs.join(',');

    try {
        // Retrieve badges from API
        const res = await axios.get(`${apiURL}/badges?ids=${badgeIDString}`, {
            withCredentials: true
        });

        // Add badges to store
        return dispatch({
            type: SET_BADGES,
            badges: res.data.badges
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
// Retrieves all active badges
export const getAllBadges = () => async dispatch => {
    try {
        // Retrieve badges from API
        const res = await axios.get(`${apiURL}/badges?active=true`, {
            withCredentials: true
        });

        // Add badges to store
        return dispatch({
            type: SET_BADGES,
            badges: res.data.badges
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
