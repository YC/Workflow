import axios from 'axios';
import { apiURL } from './connection';
import { findTeamShortName } from './team';
// Import actions from action types
import {
    ADD_TEAM_THREADS,
    ADD_TEAM_THREAD,
    SET_STATUS
} from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Fetch forum of specified team
export const fetchForum = (teamID, teamShortName) => async dispatch => {
    try {
        // Retrieve threads from API
        const res = await axios.get(`${apiURL}/teams/${teamID}/threads`, {
            withCredentials: true
        });

        // Add threads to store
        return dispatch({
            type: ADD_TEAM_THREADS,
            teamShortName,
            threads: res.data.threads
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
// Adds the given thread to the specified team
export const addThread = (teamID, thread) => async (dispatch, getState) => {
    try {
        // Find the name of the team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Send the thread
        const res = await axios.post(
            `${apiURL}/teams/${teamID}/threads`,
            thread,
            {
                withCredentials: true
            }
        );

        // Add the thread to the store
        return dispatch({
            type: ADD_TEAM_THREAD,
            teamShortName,
            thread: res.data
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
// Adds a comment to the specified thread
export const addThreadComment = (teamID, threadID, comment) => async (
    dispatch,
    getState
) => {
    try {
        // Find the name of the team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Send the comment
        const res = await axios.post(
            `${apiURL}/teams/${teamID}/threads/${threadID}`,
            comment,
            {
                withCredentials: true
            }
        );

        // Update the thread
        return dispatch({
            type: ADD_TEAM_THREAD,
            teamShortName,
            thread: res.data
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
