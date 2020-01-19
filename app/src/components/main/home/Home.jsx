import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Import Feed component and fetchPosts action
import Feed from '../feed/Feed';
import { fetchPosts } from '../../../actions/team';

// Component for home page
export class HomePage extends React.Component {
    // Initialise state
    constructor(props) {
        super(props);
        this.state = { anchorEl: null };
    }

    // Reset flag
    componentDidMount() {
        this.setState({ postsRequested: false });
    }

    componentDidUpdate() {
        // Gets teams and posts from props
        const { teams, fetchPosts } = this.props;

        // If teams are not available yet, do nothing
        if (!teams) {
            return;
        }

        // Fetch posts
        if (!this.state.postsRequested) {
            // For each team in teams
            for (let team of Object.keys(teams)) {
                // If posts of team have already been retrieved
                if (teams[team].posts) {
                    continue;
                }
                // If not, retrieve posts
                fetchPosts(teams[team].shortName);
            }
            this.setState({ postsRequested: true });
        }
    }

    render() {
        // Extract props
        const { teams, members, user } = this.props;

        // Render nothing if teams have not been retrieved
        if (!teams) {
            return null;
        }

        // Collect posts for each team
        let posts = [];
        for (let team_shortname of Object.keys(teams)) {
            let team = teams[team_shortname];
            if (team.posts) {
                for (let postID of Object.keys(team.posts)) {
                    posts.push(team.posts[postID]);
                }
            }
        }

        // Render a Feed component with the collected posts
        return (
            <React.Fragment>
                <Helmet>
                    <title>Home</title>
                </Helmet>
                <Feed
                    members={members}
                    teams={teams}
                    posts={posts}
                    user={user}
                    type="home"
                />
            </React.Fragment>
        );
    }
}

// Map fetchPosts action to props
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchPosts: fetchPosts }, dispatch);
}

// Define props
HomePage.propTypes = {
    teams: PropTypes.object,
    members: PropTypes.object.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};
export default connect(
    null,
    mapDispatchToProps
)(HomePage);
