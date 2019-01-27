import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

// Import auth styling
import './auth.css';

// Import pages
import GridCenter from './layout/GridCenter';
import Login from './login';
import Registration from './registration';
import Success from './success';
import NotFound from '../misc/NotFound';

// Import user actions
import * as UserActions from '../../actions/user';

// Component for /auth paths of app
export class Auth extends React.Component {
    // Apply background
    componentDidMount() {
        document.body.style.backgroundImage = 'url("../doodles.png")';
    }

    // Remove background on component dismount
    componentWillUnmount() {
        document.body.style.backgroundImage = 'none';
    }

    // Match various paths and render the appropriate component/page
    render() {
        // Extract state/actions/path from props
        const { state, actions, match } = this.props;

        return (
            <GridCenter>
                <Switch>
                    {/* Login Route */}
                    <Route
                        path={`${match.path}/login`}
                        render={() => (
                            <Login
                                user={state.user}
                                userLogin={actions.userLogin}
                            />
                        )}
                    />
                    {/* Register Route */}
                    <Route
                        path={`${match.path}/register`}
                        render={() => (
                            <Registration
                                user={state.user}
                                userRegister={actions.userRegister}
                            />
                        )}
                    />
                    {/* Success Route */}
                    <Route path={`${match.path}/success`} component={Success} />

                    {/* Any other routes will map to NotFound */}
                    <Route component={NotFound} />
                </Switch>
            </GridCenter>
        );
    }
}

// Define props
Auth.propTypes = {
    match: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};
// Bind user actions
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(UserActions, dispatch) };
}
// Maps state to props
function mapStateToProps(state) {
    return { state: state };
}
export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Auth)
);
