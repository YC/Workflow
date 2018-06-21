import React from 'react';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Scroll from 'react-scroll';
import Grid from '@material-ui/core/Grid';

// Pages
import Container from './container';
import Home from './home';
import Team from './team';
import Member from './member';
import Redeem from './redeem';
import Search from './search';
import News from './news';
import NotFound from '../misc/NotFound';
import * as TeamActions from '../../actions/team';
import * as UserActions from '../../actions/user';

export class Main extends React.Component {
    state = {
        teamsRetrieved: false
    };

    componentDidMount() {
        const { actions, state } = this.props;
        const { user } = state;

        // Try to recover session
        if (state && !user) {
            actions.recoverSession();
        }
        this.setState({ teamsRetrieved: false });
    }

    componentDidUpdate() {
        const { history, actions, state } = this.props;
        const { teamsRetrieved } = this.state;
        const { user } = state;

        // If user is not authenticated and session cannot be restored
        if (user && user.status === 'failure') {
            history.push('/auth/login');
        }

        if (user && user.status === 'success' && !teamsRetrieved) {
            // Get teams on mount
            actions.updateTeams();
            this.setState({ teamsRetrieved: true });
        }
    }

    componentWillReceiveProps(props) {
        // Adapted from:
        // https://github.com/ReactTraining/react-router/issues/2019
        const scroll = Scroll.animateScroll;
        if (props.location !== this.props.location) {
            scroll.scrollToTop({
                duration: 500
            });
        }
    }

    // Adapted from https://material-ui-next.com/demos/app-bar/
    render() {
        const { match, state } = this.props;
        const { user, teams, redeemables, members, badges, search } = state;

        // User not authenticated
        if (!user) {
            return null;
        }
        return (
            <Container teams={teams} user={user}>
                <Grid container spacing={32}>
                    {/* Topbar + Sidebar with Routes/pages as children */}
                    <Grid item xs={12} sm={8}>
                        <Switch>
                            {/* Redeem page */}
                            <Route
                                path={`${match.path}me/redeem`}
                                render={() => (
                                    <Redeem
                                        user={user}
                                        redeemables={redeemables}
                                    />
                                )}
                            />
                            {/* Team pages */}
                            <Route
                                path={`${match.path}teams/:shortName`}
                                render={() => (
                                    <Team
                                        teams={teams}
                                        members={members}
                                        user={user}
                                        badges={badges}
                                    />
                                )}
                            />
                            {/* Member pages */}
                            <Route
                                path={`${match.path}members/:username`}
                                render={() => (
                                    <Member
                                        members={members}
                                        user={user}
                                        badges={badges}
                                    />
                                )}
                            />
                            {/* Search page*/}
                            <Route
                                exact
                                path={`${match.path}search`}
                                render={() => (
                                    <Search
                                        search={search}
                                        teams={teams}
                                        members={members}
                                        user={user}
                                    />
                                )}
                            />

                            {/* Index/home page */}
                            <Route
                                exact
                                path={`${match.path}`}
                                render={() => (
                                    <Home
                                        user={user}
                                        teams={teams}
                                        members={members}
                                    />
                                )}
                            />

                            <Route component={NotFound} />
                        </Switch>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {teams && <News teams={teams} />}
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

// Map state
function mapStateToProps(state) {
    return { state: state };
}
// Match dispatch
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
            Object.assign({}, TeamActions, UserActions),
            dispatch
        )
    };
}

Main.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
