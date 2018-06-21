// Import constants from action types
import { SET_BADGES } from '../constants/actionTypes';

// Reducer for badges
const badges = (state = {}, action) => {
    switch (action.type) {
        // Adds badges to state
        case SET_BADGES: {
            // Transform action.badges to object with ID of badge as key and
            // the badge as value
            let badges = {};
            for (let badge of action.badges) {
                badges[badge.id] = badge;
            }
            return Object.assign({}, state, badges);
        }
        default:
            return state;
    }
};
export default badges;
