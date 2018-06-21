// Import the constants from action types
import {
    SET_USER_REDEEMED,
    ADD_USER_REDEEM,
    REDUCE_USER_REP,
    AUTHENTICATED,
    AUTHENTICATION_ERROR,
    REGISTER_USER
} from '../constants/actionTypes';

// Reducer for user
const user = (state = null, action) => {
    switch (action.type) {
        // If user is logged in
        case AUTHENTICATED:
            return {
                ...action.user,
                status: action.status
            };

        // If user does not exist
        case AUTHENTICATION_ERROR:
            return {
                status: action.status
            };

        // Register user
        case REGISTER_USER:
            return {
                ...action.user,
                status: action.status
            };

        // Set the redeemed items of the user
        case SET_USER_REDEEMED:
            return {
                ...state,
                redeemed: action.redeemed
            };

        // Add a redeemed item
        case ADD_USER_REDEEM: {
            return {
                ...state,
                redeemed: [...state.redeemed, action.redeem]
            };
        }

        // Reduce the rep of the user
        case REDUCE_USER_REP:
            return {
                ...state,
                rep: state.rep - action.rep
            };

        default:
            return state;
    }
};

export default user;
