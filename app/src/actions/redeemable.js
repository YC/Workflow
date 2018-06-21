import axios from 'axios';
import { apiURL } from './connection';
// Import constants from action types
import { ADD_REDEEMABLES, SET_STATUS } from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Retrieves all active redeemables
export const getActiveRedeemables = () => async dispatch => {
    try {
        // Retrieve all active redeemables
        const res = await axios.get(`${apiURL}/redeems?active=true`, {
            withCredentials: true
        });

        // Add retrieved redeemables to store
        return dispatch({
            type: ADD_REDEEMABLES,
            redeemables: res.data.redeemables
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
// Retrieves and adds specified redeemables to store
export const getRedeemables = redeemableIDs => async dispatch => {
    try {
        // Join the IDs of the redeemables to condense request
        let redeemableString = redeemableIDs.join(',');
        // Retrieve specified redeemables from API
        const res = await axios.get(
            `${apiURL}/redeems?ids=${redeemableString}`,
            {
                withCredentials: true
            }
        );

        // Add returned redeemables to store
        return dispatch({
            type: ADD_REDEEMABLES,
            redeemables: res.data.redeemables
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
