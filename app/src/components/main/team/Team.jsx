import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

// Import material-ui components
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Import Team page components
import Feed from '../feed';
import Member from './member';
import Forum from './forum';
import Settings from './settings';
import NotFound from '../../misc/NotFound';
// Import actions
import * as TeamActions from '../../../actions/team';

// Component for team page
// https://material-ui-next.com/demos/tabs/#scrollable-tabs
class Team extends React.Component {
    constructor(props) {
        super(props);

        // Initialise state
        this.state = {
            team_loaded: false,
            value: 0,
            title: 'Team'
        };
        // Bind functions
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Extract props
        const { match, location } = this.props;

        // Set name of team
        this.setState({ shortName: match.params.shortName });
        this.setState({ team_loaded: false });

        // Navigate to appropriate tab
        switch (location.hash) {
            case '#feed':
                this.setState({ value: 0 });
                break;
            case '#members':
                this.setState({ value: 1 });
                break;
            case '#forum':
                this.setState({ value: 2 });
                break;
            case '#settings':
                this.setState({ value: 3 });
                break;
            default:
                break;
        }
    }

    componentDidUpdate() {
        // Extract props
        const { teams, fetchPosts, match } = this.props;

        // Load this team
        if (!this.state.team_loaded && teams) {
            // Set team
            let team = teams[match.params.shortName];
            // If the team does not exist or user has no permission
            // to access team
            if (!team) {
                this.setState({ team: null, team_loaded: true });
                return;
            } else {
                this.setState({
                    team: team,
                    team_loaded: true,
                    title: team.name
                });
            }

            // Fetch posts for team
            if (!team.posts) {
                fetchPosts(match.params.shortName);
            }
        }
    }

    // Has navigated to another team, so need to reset shortname and flag
    // This then triggers a componentDidUpdate
    componentWillReceiveProps(newProps) {
        const { match } = this.props;
        // Set new props, update path
        this.props = newProps;
        this.setState({
            shortName: match.params.shortName,
            team_loaded: false
        });
    }

    // Used to change tabs
    handleChange(event, value) {
        this.setState({ value });
    }

    render() {
        // Get tab index/team from state
        const { value, team } = this.state;
        // Extract props
        const {
            members,
            badges,
            user,
            uploadTeamAvatar,
            addNewsItem,
            awardBadge
        } = this.props;

        // Build the feed
        const feed = () => {
            // Build posts array
            const team_posts = team.posts;
            const posts = Object.keys(team_posts).map(
                postID => team_posts[postID]
            );

            // Return resultant Feed component
            return (
                <Feed
                    posterMargin={true}
                    members={members}
                    posts={posts}
                    user={user}
                    type="team"
                    parentID={team.id}
                />
            );
        };

        // If the teams of user has been loaded and this team is not
        // in those teams
        if (!team && this.state.team_loaded) {
            return <NotFound />;
        }
        // If team has not been loaded
        if (!team) {
            return null;
        }

        return (
            <React.Fragment>
                {/* Define page title */}
                <Helmet title={this.state.title} />

                {/* Define tabs */}
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        scrollable
                        scrollButtons="off"
                        onChange={this.handleChange}
                    >
                        <Tab label="Feed" component={Link} to="#feed" />
                        <Tab label="Members" component={Link} to="#members" />
                        <Tab label="Forum" component={Link} to="#forum" />
                        {/* Render Settings when user is manager of team */}
                        {(team.managers.includes(user.id) ||
                            user.scope.includes('admin')) &&
                            <Tab label="Settings"
                                component={Link}
                                to='#settings' /> // prettier-ignore
                        }
                    </Tabs>
                </AppBar>

                {/* Depending on the value of the tab, render the correct
                     subpage */}

                {/* Render the feed if the team has been set and the posts
                    of the team has been retrieved */}
                {value === 0 && team.posts && feed()}

                {/* Render members tab */}
                {value === 1 && <Member team={team} members={members} />}

                {/* Render forums tab */}
                {value === 2 && <Forum team={team} members={members} />}

                {/* Render settings tab */}
                {value === 3 && (
                    <Settings
                        team={this.state.team}
                        uploadAvatar={uploadTeamAvatar}
                        addNewsItem={addNewsItem}
                        awardBadge={awardBadge}
                        badges={badges}
                        members={members}
                    />
                )}
            </React.Fragment>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators(
        {
            fetchPosts: TeamActions.fetchPosts,
            uploadTeamAvatar: TeamActions.uploadTeamAvatar,
            addNewsItem: TeamActions.addNewsItem,
            awardBadge: TeamActions.awardBadge
        },
        dispatch
    );
};

// Define props
Team.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    badges: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    teams: PropTypes.object,
    members: PropTypes.object.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    uploadTeamAvatar: PropTypes.func.isRequired,
    addNewsItem: PropTypes.func.isRequired,
    awardBadge: PropTypes.func.isRequired
};
export default withRouter(connect(null, matchDispatchToProps)(Team));
