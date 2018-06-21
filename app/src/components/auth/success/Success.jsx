import React from 'react';
import Helmet from 'react-helmet';
import Typography from '@material-ui/core/Typography';

// Component for success page
export class SuccessPage extends React.Component {
    render() {
        return (
            <div>
                <Helmet title="Success" />
                <Typography variant="display3">
                    Thank you for registering!
                </Typography>
                <Typography variant="title">
                    An admin will review your registration shortly.
                </Typography>
            </div>
        );
    }
}
export default SuccessPage;
