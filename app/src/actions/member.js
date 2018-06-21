import axios from 'axios';
import { apiURL } from './connection';
// Import constants from action types
import {
    ADD_MEMBER,
    ADD_MEMBERS,
    SET_MEMBER_BADGES,
    SET_MEMBER_POSTS,
    ADD_MEMBER_POST,
    ADD_MEMBER_POST_UPVOTE,
    REMOVE_MEMBER_POST_UPVOTE,
    UPDATE_MEMBER_AVATAR,
    SET_STATUS
} from '../constants/actionTypes';

// -----------------------------------------------------------------------
// Retrieves member with specified memberID
export const getMember = memberID => async dispatch => {
    try {
        // Retrieve member from API
        const res = await axios.get(`${apiURL}/members/${memberID}`, {
            withCredentials: true
        });

        // Add member to store
        return dispatch({
            type: ADD_MEMBER,
            member: res.data,
            memberID
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};

// Get members with specified memberIDs
export const getMembers = memberIDs => async dispatch => {
    try {
        // Join the IDs together to condense request
        const membersString = memberIDs.join(',');
        // Retrieve the specified members by querying API
        const res = await axios.get(`${apiURL}/members?ids=${membersString}`, {
            withCredentials: true
        });

        // Add members to store
        return dispatch({
            type: ADD_MEMBERS,
            members: res.data.members
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
// Retrieves member with specified username
export const getMemberByUsername = username => async dispatch => {
    try {
        // Retrieve a member by their username
        const res = await axios.get(`${apiURL}/members?username=${username}`, {
            withCredentials: true
        });
        const member = res.data.members[0];

        // If the member does not exist, set the status to 'false'
        if (!member) {
            return dispatch({
                type: ADD_MEMBER,
                member: {
                    username: username,
                    status: false
                },
                memberID: undefined
            });
        }

        // Member exists, add member to store
        return dispatch({
            type: ADD_MEMBER,
            memberID: member.id,
            member: member
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
// Gets the badges of specified member
export const getMemberBadges = memberID => async dispatch => {
    try {
        // Fetch the badges of the specified member
        const res = await axios.get(`${apiURL}/members/${memberID}/badges`, {
            withCredentials: true
        });

        // Attach badges to member
        return dispatch({
            type: SET_MEMBER_BADGES,
            memberID,
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
// Retrieves posts of specified member
export const getPosts = memberID => async dispatch => {
    try {
        // Fetch all posts of the specified member
        const res = await axios.get(`${apiURL}/members/${memberID}/posts`, {
            withCredentials: true
        });

        // Attach posts to member
        return dispatch({
            type: SET_MEMBER_POSTS,
            memberID,
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
// Adds a post to the specified member's feed
export const addPost = (memberID, post) => async dispatch => {
    try {
        // Send the post to the API
        const res = await axios.post(
            `${apiURL}/members/${memberID}/posts`,
            post,
            {
                withCredentials: true
            }
        );
        dispatch({ type: 'REDUCE_USER_REP', rep: post.rep });

        // Add post to store
        return dispatch({
            type: ADD_MEMBER_POST,
            memberID,
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
// Adds a comment to the specified post of the specified member
export const addMemberComment = (
    memberID,
    postID,
    comment
) => async dispatch => {
    try {
        // Send the comment to the API with appropriate params
        const res = await axios.post(
            `${apiURL}/members/${memberID}/posts/${postID}`,
            comment,
            { withCredentials: true }
        );

        // Update post in store
        return dispatch({
            type: ADD_MEMBER_POST,
            memberID,
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
// Adds the user's upvote to the specified post
export const addUpvote = (memberID, postID) => async (dispatch, getState) => {
    try {
        // Submit the upvote to the API
        const res = await axios.post(
            `${apiURL}/members/${memberID}/posts/${postID}/upvote`,
            {},
            { withCredentials: true }
        );

        // Add the vote to the post
        return dispatch({
            type: ADD_MEMBER_POST_UPVOTE,
            memberID,
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
// Removes the user's upvote from the specified post
export const removeUpvote = (memberID, postID) => async (
    dispatch,
    getState
) => {
    try {
        // Submit the removal of the upvote to the API
        const res = await axios.delete(
            `${apiURL}/members/${memberID}/posts/${postID}/upvote`,
            { withCredentials: true }
        );

        // Remove the upvote from the post
        return dispatch({
            type: REMOVE_MEMBER_POST_UPVOTE,
            memberID,
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
// Updates the user's avatar
export const uploadMemberAvatar = (memberID, file) => async dispatch => {
    try {
        // Set headers
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        };
        // Create FormData (as file will sent as multipart form data)
        let fd = new FormData();
        fd.append('avatar', file);
        // Send avatar to API
        const res = await axios.put(
            `${apiURL}/members/${memberID}/avatar`,
            fd,
            config
        );

        // Update the avatar of the user (in store)
        return dispatch({
            type: UPDATE_MEMBER_AVATAR,
            avatar: res.data.avatar,
            memberID
        });
    } catch (err) {
        return dispatch({
            type: SET_STATUS,
            error: err,
            status: 'failure'
        });
    }
};
