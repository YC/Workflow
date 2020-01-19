import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Status component
class Status extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state
        this.state = { current: null, display: false };
    }

    // When new props are received
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { status } = this.props;
        const { current } = prevState;
        const { display } = this.state;

        // If status has been updated, set it
        if (status !== current) {
            this.setState({ current: status, display: true });
        }

        // If status has been changed, display it for 2000ms
        if (status && display) {
            setTimeout(
                function() {
                    this.setState({ display: false });
                }.bind(this),
                4000
            );
        }
    }

    render() {
        // Extract props/state
        const { status } = this.props;
        const { display } = this.state;

        // Generate the display text for failures (when appropriate)
        let displayText = '';
        if (status && status.status === 'failure') {
            if (status.response.response && status.response.response.data) {
                displayText = 'Error: ' + status.response.response.data.message;
            } else if (status.response) {
                displayText = 'Error: ' + status.response.message;
            } else {
                displayText = 'Unknown Error';
            }
        }

        // If there has been a failure or a success, display the component
        // with appropriate classes
        if (status && status.status === 'failure') {
            return (
                <footer id="status" className={display ? 'show failure' : ''}>
                    {displayText}
                </footer>
            );
        } else if (status && status.status === 'success') {
            return (
                <footer
                    id="status"
                    className={display ? 'show success' : 'success'}
                >
                    {status.message}
                </footer>
            );
        } else {
            // If not, display empty offscreen footer
            return <footer id="status" />;
        }
    }
}

// Map state.status to props.status
function mapStateToProps(state) {
    return { status: state.status };
}
// Define status prop
Status.propTypes = {
    status: PropTypes.object
};
export default connect(
    mapStateToProps,
    null
)(Status);
