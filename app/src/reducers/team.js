// Import constants from action types
import {
    UPDATE_TEAM_AVATAR,
    SET_TEAMS,
    ADD_TEAM_POSTS,
    ADD_TEAM_POST,
    ADD_TEAM_COMMENT,
    ADD_TEAM_POST_UPVOTE,
    ADD_TEAM_THREADS,
    ADD_TEAM_THREAD,
    REMOVE_TEAM_POST_UPVOTE,
    ADD_TEAM_NEWSITEM
} from '../constants/actionTypes';

// Reducer for teams
const teams = (state = null, action) => {
    switch (action.type) {
        // Set teams
        case SET_TEAMS: {
            // Transform array of teams into object with team shortName as key
            // and the team as value
            let teams = {};
            for (let team of action.teams) {
                teams[team.shortName] = team;
            }
            return teams;
        }

        // Update avatar of specified team
        case UPDATE_TEAM_AVATAR: {
            // Set team.avatar to given avatar URL
            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    avatar: action.avatar
                }
            };
        }

        // Receive posts for specified team
        case ADD_TEAM_POSTS: {
            // Transform array of posts into objects with post ID as key
            // and the post object as value
            let posts = {};
            for (let post of action.posts) {
                posts[post.id] = post;
            }

            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    posts
                }
            };
        }

        // Receive a single post for the specified team
        case ADD_TEAM_POST:
            if (state[action.teamShortName].posts[action.post.id]) {
                // If the post already exists and an update is made
                return {
                    ...state,
                    [action.teamShortName]: {
                        ...state[action.teamShortName],
                        posts: {
                            ...state[action.teamShortName].posts,
                            [action.post.id]: {
                                ...action.post,
                                updatedAt:
                                    state[action.teamShortName].posts[
                                        action.post.id
                                    ].updatedAt
                            }
                        }
                    }
                };
            } else {
                // If the post is new
                return {
                    ...state,
                    [action.teamShortName]: {
                        ...state[action.teamShortName],
                        posts: {
                            ...state[action.teamShortName].posts,
                            [action.post.id]: action.post
                        }
                    }
                };
            }

        // Receive threads for the specified team
        case ADD_TEAM_THREADS: {
            // Transform array of threads into objects with thread ID as key
            // and the thread object as value
            let threads = {};
            for (let thread of action.threads) {
                threads[thread.id] = thread;
            }

            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    threads: threads
                }
            };
        }
        // Sets a thread for the specified team
        case ADD_TEAM_THREAD: {
            if (state[action.teamShortName].threads[action.thread.id]) {
                // If the thread already exists and an update is made
                // keep the origin updatedAt time
                return {
                    ...state,
                    [action.teamShortName]: {
                        ...state[action.teamShortName],
                        threads: {
                            ...state[action.teamShortName].threads,
                            [action.thread.id]: {
                                ...action.thread,
                                updatedAt:
                                    state[action.teamShortName].threads[
                                        action.thread.id
                                    ].updatedAt
                            }
                        }
                    }
                };
            } else {
                // If not, add the new thread
                return {
                    ...state,
                    [action.teamShortName]: {
                        ...state[action.teamShortName],
                        threads: {
                            ...state[action.teamShortName].threads,
                            [action.thread.id]: action.thread
                        }
                    }
                };
            }
        }

        // Adds a news item to the specified team
        case ADD_TEAM_NEWSITEM:
            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    newsItems: [
                        ...state[action.teamShortName].newsItems,
                        action.item
                    ]
                }
            };

        // Adds a comment for the specified post of the specified team
        case ADD_TEAM_COMMENT:
            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    posts: {
                        ...state[action.teamShortName].posts,
                        [action.postID]: {
                            ...state[action.teamShortName].posts[action.postID],
                            comments: [
                                ...state[action.teamShortName].posts[
                                    action.postID
                                ].comments,
                                action.comment
                            ]
                        }
                    }
                }
            };

        // Add upvote to the specified team post
        case ADD_TEAM_POST_UPVOTE:
            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    posts: {
                        ...state[action.teamShortName].posts,
                        [action.postID]: {
                            ...state[action.teamShortName].posts[action.postID],
                            upvotes: [
                                ...state[action.teamShortName].posts[
                                    action.postID
                                ].upvotes,
                                action.userID
                            ]
                        }
                    }
                }
            };

        // Removes an upvote from the specified team post
        case REMOVE_TEAM_POST_UPVOTE:
            return {
                ...state,
                [action.teamShortName]: {
                    ...state[action.teamShortName],
                    posts: {
                        ...state[action.teamShortName].posts,
                        [action.postID]: {
                            ...state[action.teamShortName].posts[action.postID],
                            upvotes: state[action.teamShortName].posts[
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

export default teams;
