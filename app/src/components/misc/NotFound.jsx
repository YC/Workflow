import React from 'react';
import Typography from '@material-ui/core/Typography';

// Component for Not Found page
export class NotFound extends React.Component {
    // Render text
    render() {
        return (
            <div className="misc-container">
                <Typography variant="h3">404 Page Not Found</Typography>
            </div>
        );
    }
}
export default NotFound;
