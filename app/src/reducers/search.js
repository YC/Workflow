// Import the constants from action types
import { SET_SEARCH } from '../constants/actionTypes';

// Reducer for search
const search = (state = null, action) => {
    switch (action.type) {
        // Set search results
        case SET_SEARCH:
            return action.data;
        default:
            return state;
    }
};

export default search;
