import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// material-ui imports
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

// Import required actions
import {
    getActiveRedeemables,
    getRedeemables
} from '../../../actions/redeemable';
import { getRedeemed, addRedeem } from '../../../actions/user';

// Table bodies/style
import Redeemed from './Redeemed';
import Redeemables from './Redeemables';
import styles from './RedeemStyle';

// Component for redeem page
export class Redeem extends React.Component {
    // Initial state
    state = {
        redeem_requested: false
    };

    componentDidMount() {
        // Get user, actions and redeemables from props
        const {
            user,
            redeemables,
            getActiveRedeemables,
            getRedeemed
        } = this.props;

        // Get all active redeemables
        if (!redeemables) {
            getActiveRedeemables();
        }

        // Get items redeemed by this user
        if (!user.redeemed) {
            getRedeemed();
        }
    }

    componentDidUpdate() {
        // Get user, actions and redeemables from props
        const { user, redeemables, getRedeemables } = this.props;

        // If info about redeemables have not been requested, request them
        if (user.redeemed && !this.state.redeem_requested) {
            // Build list of non loaded items
            let nonLoaded = [];
            for (let redeemed of user.redeemed) {
                if (!redeemables || !redeemables[redeemed.redeemableID]) {
                    nonLoaded.push(redeemed.redeemableID);
                }
            }

            // If list is not empty, retrieve mentioned redeemables
            if (nonLoaded.length > 0) {
                getRedeemables(nonLoaded);
            }
            this.setState({ redeem_requested: true });
        }
    }

    render() {
        // Extract props
        const { classes, user, redeemables, addRedeem } = this.props;
        const { redeemed } = user;

        return (
            <React.Fragment>
                <Helmet title="Redeem" />

                {/* Redeemables title */}
                <Typography
                    gutterBottom={true}
                    className={classes.redeemablesTitle}
                    variant="h6"
                >
                    Redeemables ({user.rep} rep available)
                </Typography>

                {/* If there are no redeemables */}
                {redeemables && redeemables.length === 0 && (
                    <Typography>There are no redeemables...</Typography>
                )}

                {/* List redeemables (items that user is able to redeem) */}
                <Paper>
                    {redeemables && (
                        <Redeemables
                            userRep={user.rep}
                            redeemables={redeemables}
                            addRedeem={addRedeem}
                        />
                    )}
                </Paper>

                {/* Redeemed title */}
                <Typography
                    gutterBottom={true}
                    className={classes.redeemedTitle}
                    variant="h6"
                >
                    Redeemed
                </Typography>

                {/* If user has no redeemed items */}
                {redeemed && redeemed.length === 0 && (
                    <Typography>You have no redeemed items...</Typography>
                )}

                {/* List redeemed items (that user has already redeemed) */}
                <Paper>
                    {redeemed && redeemed.length !== 0 && redeemables && (
                        <Redeemed
                            redeemed={redeemed}
                            redeemables={redeemables}
                        />
                    )}
                </Paper>
            </React.Fragment>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators(
        { getActiveRedeemables, getRedeemables, getRedeemed, addRedeem },
        dispatch
    );
};
// Define props
Redeem.propTypes = {
    getActiveRedeemables: PropTypes.func.isRequired,
    getRedeemables: PropTypes.func.isRequired,
    getRedeemed: PropTypes.func.isRequired,
    addRedeem: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    redeemables: PropTypes.object
};
export default withStyles(styles)(
    connect(
        null,
        matchDispatchToProps
    )(Redeem)
);
