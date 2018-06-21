import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// material-ui imports
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

// Import actions, helper functions, components and styling
import { getMembers } from '../../../../actions/member';
import { getAllBadges } from '../../../../actions/badge';
import { getUnretrievedMembers, composeName } from '../../common/member';
import Avatar from '../../common/Avatar';
import styles from './SettingsStyle';
import Stars from '@material-ui/icons/Stars';

// Award Badge
class AwardBadge extends React.Component {
    // Constructor
    constructor(props) {
        super(props);

        // Define initial state
        this.state = {
            member: '',
            badge: '',
            rep: 0,
            repError: false,
            badgeError: false,
            memberError: false
        };
        // Bind functions
        this.updateBadge = this.updateBadge.bind(this);
        this.updateMember = this.updateMember.bind(this);
        this.updateRep = this.updateRep.bind(this);
        this.awardBadge = this.awardBadge.bind(this);
    }

    // On mount, reset state
    componentDidMount() {
        this.setState({ membersRetrieved: false, badgesRetrieved: false });
    }

    // On update
    componentDidUpdate() {
        // Extract props
        const { members, team, getMembers, getAllBadges, badges } = this.props;
        const { membersRetrieved, badgesRetrieved, badge, member } = this.state;

        // Retrieve all unretrieved members of team
        const unretrieved = getUnretrievedMembers(members, [
            ...team.members,
            ...team.managers
        ]);
        if (unretrieved.length > 0 && !membersRetrieved) {
            getMembers(unretrieved);
            this.setState({ membersRetrieved: true });
        } else if (!membersRetrieved) {
            this.setState({ membersRetrieved: true });
        }

        // Retrieve all badges
        if (!badgesRetrieved) {
            getAllBadges();
            this.setState({ badgesRetrieved: true });
        }

        // Set a default badge
        if (badgesRetrieved && badges && badge === '') {
            for (const badgeID of Object.keys(badges)) {
                if (badges[badgeID].active) {
                    this.setState({ badge: badgeID });
                    break;
                }
            }
        }

        // Set a default member
        if (membersRetrieved && member === '') {
            for (const memberID of [...team.members, ...team.managers]) {
                if (members[memberID]) {
                    this.setState({ member: memberID });
                    break;
                }
            }
        }
    }

    // Update currently selected badge
    updateBadge(event) {
        this.setState({ badge: event.target.value, badgeError: false });
    }
    // Update currently selected member
    updateMember(event) {
        this.setState({ member: event.target.value, memberError: false });
    }
    // Update rep
    updateRep(event) {
        this.setState({ rep: event.target.value, repError: false });
    }

    // Awards the badge
    awardBadge() {
        // Extract state/props
        const { badge, member, rep } = this.state;
        const { awardBadge, team } = this.props;

        // Perform validation
        let error = false;
        if (badge === '') {
            this.setState({ badgeError: true });
            error = true;
        }
        if (member === '') {
            this.setState({ memberError: true });
            error = true;
        }
        if (rep === '' || (!Number(rep) && Number(rep) !== 0)) {
            this.setState({ repError: true });
            error = true;
        }
        if (error) {
            return;
        }

        // Award badge
        awardBadge(team.id, { memberID: member, badgeID: badge, rep });
    }

    // When navigating to another team
    componentWillReceiveProps(props) {
        // Reretrieve members (if applicable)
        if (props.team.id !== this.props.team.id) {
            this.setState({ membersRetrieved: false, member: '' });
        }
        this.props = props;
    }

    render() {
        // Extract props/state
        const { classes, badges, members, team } = this.props;
        const {
            member,
            badge,
            repError,
            badgeError,
            memberError,
            rep
        } = this.state;

        // There are still members being retrieved
        if (
            getUnretrievedMembers(members, [...team.members, ...team.managers])
                .length > 0
        ) {
            return null;
        }

        return (
            <div className={classes.awardContainer}>
                {/* Member dropdown */}
                <FormControl className={classes.awardInput}>
                    <InputLabel htmlFor="member-select">
                        Select a Member
                    </InputLabel>

                    <Select
                        value={member}
                        onChange={this.updateMember}
                        error={memberError}
                        input={<Input id="member-select" />}
                    >
                        {/* Add name of each team member/manager */}
                        {[...team.members, ...team.managers].map(memberID => (
                            <MenuItem key={memberID} value={memberID}>
                                <ListItemText disableTypography>
                                    <Typography
                                        className={classes.dropDownStyle}
                                    >
                                        {composeName(members[memberID])}
                                    </Typography>
                                </ListItemText>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Badge dropdown */}
                <FormControl className={classes.awardInput}>
                    <InputLabel htmlFor="badge-select">
                        Select a Badge
                    </InputLabel>

                    <Select
                        value={badge}
                        onChange={this.updateBadge}
                        error={badgeError}
                        input={<Input id="badge-select" />}
                    >
                        {/* Display each badge */}
                        {Object.keys(badges).map(badgeID => {
                            const badge = badges[badgeID];
                            return (
                                <MenuItem
                                    key={badge.id}
                                    value={badge.id}
                                    className={classes.badgeListItem}
                                >
                                    <Grid container spacing={16}>
                                        {/* Avatar */}
                                        <Grid item>
                                            <Avatar avatar={badge.avatar}>
                                                {badge.name[0]}
                                            </Avatar>
                                        </Grid>
                                        {/* Text */}
                                        <Grid
                                            item
                                            className={classes.badgeListText}
                                        >
                                            <Typography
                                                variant="body1"
                                                className={
                                                    classes.dropDownStyle
                                                }
                                            >
                                                {badge.name}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* Rep field */}
                <TextField
                    className={classes.awardInput}
                    InputLabelProps={{
                        shrink: true
                    }}
                    label="Rep"
                    id="message"
                    placeholder="Give some rep..."
                    margin="normal"
                    fullWidth
                    onChange={this.updateRep}
                    error={repError}
                    value={rep}
                />

                {/* Submit button */}
                <Button color="secondary" onClick={this.awardBadge}>
                    <Stars className={classes.awardButton} />
                    Award Badge
                </Button>
            </div>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators(
        { getAllBadges: getAllBadges, getMembers: getMembers },
        dispatch
    );
};
// Define props
AwardBadge.propTypes = {
    awardBadge: PropTypes.func.isRequired,
    getMembers: PropTypes.func.isRequired,
    getAllBadges: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    badges: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(
    connect(null, matchDispatchToProps)(AwardBadge)
);
