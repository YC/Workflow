import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

// Component for redirect page
export class Redirect extends React.Component {
    componentDidMount() {
        // Force reload
        window.location.reload(true);
    }

    render() {
        return (
            <div className="misc-container">
                <Typography variant="h3">Redirecting...</Typography>
            </div>
        );
    }
}

// Define props
Redirect.propTypes = {
    history: PropTypes.object.isRequired
};
export default withRouter(Redirect);
