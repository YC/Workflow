// Import constants from action types
import { SET_STATUS } from '../constants/actionTypes';

// Reducer for badges
const status = (state = null, action) => {
    switch (action.type) {
        // Sets the status
        case SET_STATUS: {
            return {
                status: action.status,
                response: action.error,
                message: action.message
            };
        }
        default:
            return state;
    }
};
export default status;
