import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import components/actions
import FeedPost from './FeedPost';
import { getMembers } from '../../../actions/member';

// Component for content of Feed
export class FeedContent extends React.Component {
    componentDidMount() {
        // Reset state
        this.setState({
            membersRetrieved: false,
            posts: null,
            membersRequested: []
        });
    }

    componentDidUpdate() {
        // Extract props/state
        const { posts, members, getMembers } = this.props;
        const { membersRequested } = this.state;

        // Get members of each post and append to members array
        const memberIDs = [];
        for (const post of posts) {
            // Add author of post
            memberIDs.push(post.memberID);
            // Add author of comments
            for (let member of post.comments) {
                memberIDs.push(member.memberID);
            }
        }

        // Find members who are not retrieved
        let nonLoaded = memberIDs.filter(
            (memberID, index) =>
                !members[memberID] &&
                !membersRequested.includes(memberID) &&
                memberIDs.indexOf(memberID) === index
        );
        // Dispatch getMembers to get members who are not already retrieved
        if (nonLoaded.length !== 0) {
            getMembers(nonLoaded);
            this.setState({
                membersRequested: [...membersRequested, ...nonLoaded]
            });
        }
    }

    // Extracts a team from teams by ID
    extractTeamByID = (teams, teamID) => {
        for (let team of Object.keys(teams)) {
            if (teams[team].id === teamID) {
                return teams[team];
            }
        }
        return null;
    };

    render() {
        // Extract props
        const { posts, type, members, teams, userID, disabled } = this.props;

        // If there are no posts
        if (!posts) {
            return null;
        }

        // Sort posts by date
        posts
            .sort((a, b) => {
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            })
            .reverse();

        // Return FeedPosts
        return posts.map(post => {
            return (
                <FeedPost
                    key={post.id}
                    members={members}
                    type={type}
                    post={post}
                    team={
                        type === 'home' &&
                        teams &&
                        this.extractTeamByID(teams, post.parentID)
                    }
                    parentID={post.parentID}
                    userID={userID}
                    disabled={disabled}
                />
            );
        });
    }
}

// Define props
FeedContent.propTypes = {
    // Whether component is disabled
    disabled: PropTypes.bool,
    // ID of user
    userID: PropTypes.string.isRequired,
    // Parent type
    type: PropTypes.string.isRequired,
    // Generic props
    teams: PropTypes.object,
    posts: PropTypes.array.isRequired,
    members: PropTypes.object.isRequired,
    // Function for getting members
    getMembers: PropTypes.func.isRequired
};

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators({ getMembers }, dispatch);
};
export default connect(
    null,
    matchDispatchToProps
)(FeedContent);
