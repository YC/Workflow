import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';

// material-ui imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Component/actions/styles imports
import Feed from '../feed';
import Avatar from '../common/Avatar';
import BadgeContainer from './BadgeContainer';
import AvatarUpload from '../common/AvatarUpload';
import NotFound from '../../misc/NotFound';
import { getMember, composeName, getMemberInitials } from '../common/member';
import * as MemberActions from '../../../actions/member';
import styles from './MemberStyle';

// Component for Member pages
export class Member extends React.Component {
    // Initialise state
    state = {
        username: null,
        title: 'Member',
        postsRequestMade: false,
        retrieveRequestMade: false
    };

    // When component is mounted
    componentDidMount() {
        // Set username
        const { match } = this.props;
        let username = match.params.username;
        this.setState({ username: username });
    }

    componentDidUpdate() {
        // Extract props
        const { members, getMemberByUsername, getPosts } = this.props;

        // Attempt to extract member
        let member = getMember(members, this.state.username);

        // If the member is not in store, retrieve the member
        if (!member && !this.state.retrieveRequestMade) {
            getMemberByUsername(this.state.username);
            this.setState({ retrieveRequestMade: true });
            return;
        }
        // If the member is in the store, set it to this.state
        if (member && !this.state.member) {
            this.setState({
                member: member,
                title: composeName(member),
                retrieveRequestMade: true
            });
        }

        // If member does not exist or has not been retrieved yet
        if (!member || member.status === false) {
            return;
        }

        // Get posts for specified member
        if (!member.posts && !this.state.postsRequestMade) {
            this.setState({ member: member, title: composeName(member) });
            getPosts(member.id);
            this.setState({ postsRequestMade: true });
        }
        // Set the member again once posts have been retrieved
        if (member.posts && this.state.member !== member) {
            this.setState({ member: member, title: composeName(member) });
        }
    }

    // When receiving new props
    componentWillReceiveProps(newProps) {
        // Set new props
        this.props = newProps;

        // Update username if applicable
        const { match } = this.props;
        if (this.state.username !== match.params.username) {
            let username = match.params.username;
            this.setState({
                username: username,
                retrieveRequestMade: false,
                postsRequestMade: false
            });
        }
    }

    render() {
        // Extract props/state
        const {
            classes,
            members,
            user,
            badges,
            uploadMemberAvatar
        } = this.props;
        const { member, title } = this.state;

        // If member has not been loaded yet or is not valid, render nothing
        if (!('member' in this.state) || member === null) {
            return null;
        }

        // Renders the feed of the member
        const feed = () => {
            // Collect posts for member
            const member_posts = member.posts;
            const posts = Object.keys(member_posts).map(
                postID => member_posts[postID]
            );

            // Return feed component
            return (
                <Feed
                    members={members}
                    user={user}
                    posts={posts}
                    type="member"
                    parentID={member.id}
                />
            );
        };

        // If member.status is false, then the member has not been found
        if ('status' in member && member.status === false) {
            return <NotFound />;
        }

        return (
            <React.Fragment>
                <Helmet title={title} />

                {/* Basic bio information */}
                <Grid container spacing={16} className={classes.container}>
                    <Grid item className={classes.row}>
                        {/* Profile Picture Avatar */}
                        <Avatar
                            avatar={member.avatar}
                            className={classes.avatar}
                        >
                            {getMemberInitials(member)}
                        </Avatar>
                    </Grid>

                    {/* Username and Name */}
                    <Grid item className={classes.row}>
                        <Grid item className={classes.name}>
                            <Typography variant="h3">
                                {composeName(member)}
                            </Typography>
                            <Typography variant="h4">
                                @{member.username}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Avatar upload */}
                {member.username === user.username && (
                    <AvatarUpload
                        id={member.id}
                        uploadAvatar={uploadMemberAvatar}
                    />
                )}

                {/* Badges */}
                <BadgeContainer member={member} badges={badges} />

                {/* Feed */}
                {member.posts && feed()}
            </React.Fragment>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators(
        {
            getMemberByUsername: MemberActions.getMemberByUsername,
            getPosts: MemberActions.getPosts,
            uploadMemberAvatar: MemberActions.uploadMemberAvatar
        },
        dispatch
    );
};

// Declare propTypes
Member.propTypes = {
    getMemberByUsername: PropTypes.func.isRequired,
    getPosts: PropTypes.func.isRequired,
    uploadMemberAvatar: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    badges: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};
export default withRouter(
    withStyles(styles)(
        connect(
            null,
            matchDispatchToProps
        )(Member)
    )
);
