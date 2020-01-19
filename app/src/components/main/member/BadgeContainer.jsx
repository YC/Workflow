import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// material-ui imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '../common/Avatar';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Actions/styles imports
import { getMemberBadges } from '../../../actions/member';
import { getBadges } from '../../../actions/badge';
import styles from './MemberStyle';

// Component for displaying member badges
export class BadgeContainer extends React.Component {
    constructor(props) {
        super(props);

        // Initialise state
        this.state = {
            badges_requested: false,
            badges_loaded: false
        };
        // Bind function
        this.getNonloadedBadges.bind(this);
    }

    // Get non loaded badges
    getNonloadedBadges() {
        const { member, badges } = this.props;

        // Find IDs of member badges which are not in badges
        let nonLoaded = [];
        for (let badge of member.badges) {
            if (!(badge.badgeID in badges)) {
                nonLoaded.push(badge.badgeID);
            }
        }
        return nonLoaded;
    }

    componentDidMount() {
        // Extract props
        const { member, getMemberBadges } = this.props;

        // Get badges of member
        if (!('badges' in member)) {
            getMemberBadges(member.id);
        } else {
            this.setState({ badges: member.badges });
        }
    }

    componentDidUpdate() {
        const { member, badges, getBadges } = this.props;
        const { badges_requested, badges_loaded } = this.state;

        // If badges of member has been retrieved and the actual badges
        // haven't been retrieved yet
        if (badges && 'badges' in member && !badges_requested) {
            // Retrieve badges if applicable
            const nonLoaded = this.getNonloadedBadges();
            if (nonLoaded.length > 0) {
                getBadges(nonLoaded);
            }

            // Set state
            this.setState({ badges_requested: true });
            return;
        }

        // Check whether badges have been loaded
        if (badges_requested && !badges_loaded) {
            for (let badge of member.badges) {
                if (!(badge.badgeID in badges)) {
                    return;
                }
            }
            // Since there are no missing badges, the badges have been loaded
            this.setState({ badges_loaded: true });
        }

        // If there are badges which have not been retrieved, reset state
        if (this.getNonloadedBadges().length !== 0) {
            this.setState({ badges_requested: false, badges_loaded: false });
        }
    }

    render() {
        // Extract props
        const { classes, badges, member } = this.props;

        // If badges have not been loaded yet, render nothing
        if (!this.state.badges_loaded) {
            return null;
        }

        // Get badges of member
        const member_badges = member.badges;

        return (
            <Card className={classes.badgesCard}>
                {/* Heading */}
                <CardHeader title="Badges" className={classes.badgesHeader} />

                {/* Container for badges */}
                <CardContent className={classes.container}>
                    <Grid container spacing={1}>
                        {/* For each badge item */}
                        {member_badges.map(badgeItem => {
                            // Get badge from badges
                            const badge = badges[badgeItem.badgeID];
                            // Render badge with tooltip of badge description
                            return (
                                <Grid item key={badgeItem.id}>
                                    <Tooltip
                                        title={badge.description}
                                        placement="right-end"
                                    >
                                        <Avatar
                                            avatar={badge.avatar}
                                            className={classes.badgeAvatar}
                                        >
                                            {badge && badge.name.charAt(0)}
                                        </Avatar>
                                    </Tooltip>
                                </Grid>
                            );
                        })}

                        {/* If member does not have badge items */}
                        {member_badges.length === 0 && (
                            <Typography>This member has no badges</Typography>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

// Map actions to props
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getBadges, getMemberBadges }, dispatch);
}

// Define props
BadgeContainer.propTypes = {
    getBadges: PropTypes.func.isRequired,
    getMemberBadges: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    badges: PropTypes.object.isRequired,
    member: PropTypes.object.isRequired
};
export default withStyles(styles)(
    withRouter(
        connect(
            null,
            mapDispatchToProps
        )(BadgeContainer)
    )
);
