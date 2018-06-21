import { combineReducers } from 'redux';

// Import other reducers
import teams from './team';
import user from './user';
import members from './member';
import redeemables from './redeemable';
import badges from './badge';
import search from './search';
import status from './status';

// Import logout constant from action types
import { USER_LOGOUT } from '../constants/actionTypes';

// Adapted from:
// https://stackoverflow.com/questions/35622588
// Combined reducer for app
const appReducer = combineReducers({
    user,
    teams,
    badges,
    members,
    redeemables,
    search,
    status
});

// Reducer to handle user logout
const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
