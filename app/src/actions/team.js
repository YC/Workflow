import axios from 'axios';
import { apiURL } from './connection';
import { getMember } from './member';
// Import constants from action types
import {
    UPDATE_TEAM_AVATAR,
    SET_TEAMS,
    ADD_TEAM_POSTS,
    ADD_TEAM_POST,
    ADD_TEAM_POST_UPVOTE,
    REMOVE_TEAM_POST_UPVOTE,
    ADD_TEAM_NEWSITEM,
    SET_STATUS
} from '../constants/actionTypes';

// Finds the shortName of a team, given its ID
const findTeamShortName = (teams, teamID) => {
    // Loop through teams to look for team with given ID
    for (const teamShortName of Object.keys(teams)) {
        if (teams[teamShortName].id === teamID) {
            return teamShortName;
        }
    }
    return undefined;
};
export { findTeamShortName };

// -----------------------------------------------------------------------
// Retrieves all teams of the current user
export const updateTeams = () => async (dispatch, getState) => {
    try {
        // Get teams of user
        const res = await axios.get(
            `${apiURL}/members/${getState().user.id}/teams`,
            {
                withCredentials: true
            }
        );
        const teams = res.data.teams;

        // Set display names of teams
        for (const team of teams) {
            // Define displayname to be first 2 initials of team name
            const teamNameInitials = team.name.split(' ').map(n => n[0]);
            const teamNameInitialsSliced = teamNameInitials.slice(0, 2);
            team.displayname = teamNameInitialsSliced.join('');
        }

        // Add teams to store
        return dispatch({
            type: SET_TEAMS,
            teams: teams
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
// Fetch posts of specified team
export const fetchPosts = teamShortName => async (dispatch, getState) => {
    try {
        // Find ID of team
        const teamID = getState().teams[teamShortName].id;
        // Get team posts from API using determined ID
        const res = await axios.get(`${apiURL}/teams/${teamID}/posts`, {
            withCredentials: true
        });

        // Add posts to store
        return dispatch({
            type: ADD_TEAM_POSTS,
            teamShortName,
            posts: res.data.posts
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
// Adds a post to the specified team's feed
export const addPost = (teamID, post) => async (dispatch, getState) => {
    try {
        // Find shortName of team (as shortName will be used in state)
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Submit post to API
        const res = await axios.post(`${apiURL}/teams/${teamID}/posts`, post, {
            withCredentials: true
        });

        // Add the post to the store
        return dispatch({
            type: ADD_TEAM_POST,
            teamShortName,
            post: res.data
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
// Adds a comment to the specified post of the specified team
export const addTeamComment = (teamID, postID, comment) => async (
    dispatch,
    getState
) => {
    try {
        // Find shortName of team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Send comment to API
        const res = await axios.post(
            `${apiURL}/teams/${teamID}/posts/${postID}`,
            comment,
            {
                withCredentials: true
            }
        );

        // Update the post
        return dispatch({
            type: ADD_TEAM_POST,
            teamShortName,
            post: res.data
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
// Adds a vote to the specified team post
export const addUpvote = (teamID, postID) => async (dispatch, getState) => {
    try {
        // Find shortName of team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Submit vote to API
        const res = await axios.post(
            `${apiURL}/teams/${teamID}/posts/${postID}/upvote`,
            {},
            { withCredentials: true }
        );

        // Add vote to post
        return dispatch({
            type: ADD_TEAM_POST_UPVOTE,
            teamShortName,
            postID,
            userID: getState().user.id,
            vote: res.data
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
// Removes a vote from the specified team post
export const removeUpvote = (teamID, postID) => async (dispatch, getState) => {
    try {
        // Find shortName of team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Submit vote removal
        const res = await axios.delete(
            `${apiURL}/teams/${teamID}/posts/${postID}/upvote`,
            {
                withCredentials: true
            }
        );

        // Remove vote from post
        return dispatch({
            type: REMOVE_TEAM_POST_UPVOTE,
            teamShortName,
            postID,
            userID: getState().user.id,
            vote: res.data
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
// Sets the team avatar of the specified team
export const uploadTeamAvatar = (teamID, file) => async (
    dispatch,
    getState
) => {
    try {
        // Find shortName of team
        const teamShortName = findTeamShortName(getState().teams, teamID);

        // Specify headers
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        };
        // Create FormData (as file will sent as multipart form data)
        let fd = new FormData();
        fd.append('avatar', file);

        // Send avatar to API
        const res = await axios.put(
            `${apiURL}/teams/${teamID}/avatar`,
            fd,
            config
        );

        // Update team avatar
        return dispatch({
            type: UPDATE_TEAM_AVATAR,
            avatar: res.data.avatar,
            teamShortName
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
// Adds the given News Item to the specified team
export const addNewsItem = (teamID, message) => async (dispatch, getState) => {
    try {
        // Find shortName of team
        const teamShortName = findTeamShortName(getState().teams, teamID);
        // Submit news item
        const res = await axios.post(
            `${apiURL}/teams/${teamID}/news`,
            { message: message },
            { withCredentials: true }
        );

        // Add news item to team (in store)
        return dispatch({
            type: ADD_TEAM_NEWSITEM,
            item: res.data,
            teamShortName
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
// Awards specified badge to the specified team member
export const awardBadge = (teamID, payload) => async (dispatch, getState) => {
    try {
        // Make request to API
        await axios.post(`${apiURL}/teams/${teamID}/award/badge`, payload, {
            withCredentials: true
        });

        // If the member is currently in the reducer, update it
        if (getState().members[payload.memberID]) {
            dispatch(getMember(payload.memberID));
        }
        // Modify state (such that a success message will be displayed)
        return dispatch({
            type: SET_STATUS,
            message: 'Badge awarded',
            status: 'success'
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
