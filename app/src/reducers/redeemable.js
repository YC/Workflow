// Import constants from action types
import { ADD_REDEEMABLES } from '../constants/actionTypes';

// Reducer for redeemables
const redeemables = (state = null, action) => {
    switch (action.type) {
        // Add redeemables to state
        case ADD_REDEEMABLES: {
            // Turn array of redeemables into object with redeemable id as key
            // and the redeemable info as value
            let idIndexedRedeemables = {};
            for (let redeemable of action.redeemables) {
                idIndexedRedeemables[redeemable.id] = redeemable;
            }
            // Assign that to state
            return Object.assign({}, state, idIndexedRedeemables);
        }
        default:
            return state;
    }
};

export default redeemables;
