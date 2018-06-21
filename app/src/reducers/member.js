// Import constants from action types
import {
    UPDATE_MEMBER_AVATAR,
    ADD_MEMBER,
    ADD_MEMBERS,
    SET_MEMBER_BADGES,
    SET_MEMBER_POSTS,
    ADD_MEMBER_POST,
    ADD_MEMBER_COMMENT,
    ADD_MEMBER_POST_UPVOTE,
    REMOVE_MEMBER_POST_UPVOTE
} from '../constants/actionTypes';

// Reducer for members
const members = (state = {}, action) => {
    switch (action.type) {
        // Add a member to state
        case ADD_MEMBER: {
            // Add member with memberID as key and the member as value
            return {
                ...state,
                [action.memberID]: action.member
            };
        }

        // Add multiple members to state
        case ADD_MEMBERS: {
            // Transform action.members to object with memberID as key and
            // the member as value
            let members = {};
            for (let member of action.members) {
                members[member.id] = member;
            }
            return Object.assign({}, state, members);
        }

        // Updates member's avatar
        case UPDATE_MEMBER_AVATAR: {
            // Update value of member.avatar to given avatar URL
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    avatar: action.avatar
                }
            };
        }

        // Set badges of specified member
        case SET_MEMBER_BADGES:
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    badges: action.badges
                }
            };

        // Set posts of specified member
        case SET_MEMBER_POSTS: {
            // Transform array of posts into objects with post ID as key
            // and the post object as value
            let posts = {};
            for (let post of action.posts) {
                posts[post.id] = post;
            }

            // Add posts to specified member
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    posts: posts
                }
            };
        }

        // Add post to specified member
        case ADD_MEMBER_POST:
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    posts: {
                        ...state[action.memberID].posts,
                        [action.post.id]: action.post
                    }
                }
            };

        // Adds a comment for the specified post of the specified member
        case ADD_MEMBER_COMMENT:
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    posts: {
                        ...state[action.memberID].posts,
                        [action.postID]: {
                            ...state[action.memberID].posts[action.postID],
                            comments: [
                                ...state[action.memberID].posts[action.postID]
                                    .comments,
                                action.comment
                            ]
                        }
                    }
                }
            };

        // Add an upvote to a post of the specified member
        case ADD_MEMBER_POST_UPVOTE:
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    posts: {
                        ...state[action.memberID].posts,
                        [action.postID]: {
                            ...state[action.memberID].posts[action.postID],
                            upvotes: [
                                ...state[action.memberID].posts[action.postID]
                                    .upvotes,
                                action.userID
                            ]
                        }
                    }
                }
            };

        // Removes an upvote from a post of the specified number
        case REMOVE_MEMBER_POST_UPVOTE:
            return {
                ...state,
                [action.memberID]: {
                    ...state[action.memberID],
                    posts: {
                        ...state[action.memberID].posts,
                        [action.postID]: {
                            ...state[action.memberID].posts[action.postID],
                            upvotes: state[action.memberID].posts[
                                action.postID
                            ].upvotes.filter(item => item !== action.userID)
                        }
                    }
                }
            };

        default:
            return state;
    }
};

export default members;
