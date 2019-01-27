import React from 'react';
import PropTypes from 'prop-types';

// material-ui imports
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

// Import components/styles
import AvatarUpload from '../../common/AvatarUpload';
import AwardBadge from './AwardBadge';
import styles from './SettingsStyle';

// Component for team settings page (available to managers/admins only)
class Settings extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        // Initalise state and bind actions
        this.state = { message: '', messageError: false };
        this.addNewsItem = this.addNewsItem.bind(this);
        this.setMessage = this.setMessage.bind(this);
    }

    // Handles News Item submission
    addNewsItem() {
        const { addNewsItem, team } = this.props;
        const { message } = this.state;

        // Validate the message
        if (message === '') {
            this.setState({ messageError: true });
            return;
        }
        // If message is valid, add the news item and reset the message
        addNewsItem(team.id, message);
        this.setState({ message: '' });
    }

    // Sets the News Item message
    setMessage(event) {
        this.setState({ message: event.target.value, messageError: false });
    }

    render() {
        // Extract props/state
        const {
            team,
            uploadAvatar,
            classes,
            members,
            badges,
            awardBadge
        } = this.props;
        const { message, messageError } = this.state;

        return (
            <Paper className={classes.root}>
                {/* Avatar upload */}
                <Typography variant="h4" className={classes.header}>
                    Avatar
                </Typography>
                <AvatarUpload id={team.id} uploadAvatar={uploadAvatar} />
                <Divider className={classes.divider} />

                {/* News item */}
                <Typography variant="h4" className={classes.header}>
                    Add News Item
                </Typography>
                <TextField
                    id="message"
                    placeholder="Enter a message..."
                    margin="normal"
                    fullWidth
                    onChange={this.setMessage}
                    error={messageError}
                    value={message}
                />
                <Button color="secondary" onClick={this.addNewsItem}>
                    <Add className={classes.addIcon} />
                    Add News Item
                </Button>
                <Divider className={classes.divider} />

                {/* Award badge */}
                <Typography variant="h4" className={classes.header}>
                    Award Badge
                </Typography>
                <AwardBadge
                    team={team}
                    members={members}
                    badges={badges}
                    awardBadge={awardBadge}
                />
            </Paper>
        );
    }
}

// Define props
Settings.propTypes = {
    team: PropTypes.object.isRequired,
    badges: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    awardBadge: PropTypes.func.isRequired,
    addNewsItem: PropTypes.func.isRequired,
    uploadAvatar: PropTypes.func.isRequired
};
export default withStyles(styles)(Settings);
