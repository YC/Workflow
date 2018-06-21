import axios from 'axios';
import { apiURL } from './connection';
// Import actions from action types
import { SET_SEARCH, SET_STATUS } from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Handles search requests
export const search = query => async dispatch => {
    try {
        // Send query
        let res = await axios.get(`${apiURL}/search?q=${query}`, {
            withCredentials: true
        });

        // Add response to store
        return dispatch({
            type: SET_SEARCH,
            data: res.data
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
