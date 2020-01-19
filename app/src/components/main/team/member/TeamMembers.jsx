import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import MemberBox from './MemberBox';
import styles from './TeamMemberStyle';
import * as MemberActions from '../../../../actions/member';

export class TeamMembers extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state
        this.state = {};
    }

    // On mount, set flags to false
    componentDidMount() {
        this.setState({ team_loaded: false, team_loading: false });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Extract props/state
        const { team, members, getMembers } = this.props;
        const { team_loaded, team_loading } = this.state;

        // If the team has not been loaded and is not currently loading
        if (!team_loaded && !team_loading) {
            // Get IDs for members and managers who are not loaded
            const nonLoaded = [...team.members, ...team.managers].filter(
                memberID => !(memberID in members)
            );
            // dispatch getMembers to get those members
            if (nonLoaded.length !== 0) {
                getMembers(nonLoaded);
            }

            // Set flag and return (since it's not going to retrieve members
            // that quickly)
            this.setState({ team_loading: true });
            return;
        }

        // If request to load members have been sent and members are not loaded
        if (!team_loaded && team_loading) {
            // Get members of team
            let team_members = [];
            for (let member of team.members) {
                // If not member have been retrieved yet, exit
                if (!(member in members)) {
                    return;
                }
                // Otherwise, build members array
                team_members.push(members[member]);
            }

            // Get managers of team and do the same
            let team_managers = [];
            for (let manager of team.managers) {
                if (!(manager in members)) {
                    return;
                }
                team_managers.push(members[manager]);
            }

            // Set state
            this.setState({
                members: team_members,
                managers: team_managers,
                team_loaded: true,
                team_loading: false
            });
        }

        // When navigating to another team
        if (this.props !== prevProps) {
            this.setState({ team_loaded: false, team_loading: false });
        }
    }

    render() {
        // Extract classes
        const { classes } = this.props;

        // If members have not been fully retrieved, don't render anything
        if (!('members' in this.state)) {
            return null;
        }

        return (
            <React.Fragment>
                {/* Paper to contain the MemberBoxes */}
                <Paper className={classes.root}>
                    {/* Member names */}
                    <Typography variant="h4">Members</Typography>
                    <MemberBox members={this.state.members} />

                    <Divider className={classes.divider} />

                    {/* Manager names */}
                    <Typography variant="h4">Managers</Typography>
                    <MemberBox members={this.state.managers} />
                </Paper>
            </React.Fragment>
        );
    }
}

// Prop definitions
TeamMembers.propTypes = {
    history: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    getMembers: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(
    withRouter(
        connect(
            null,
            MemberActions
        )(TeamMembers)
    )
);
