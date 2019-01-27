import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// material-ui imports
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

// Icon imports
import InputAdornment from '@material-ui/core/InputAdornment';
import Create from '@material-ui/icons/Create';
import Add from '@material-ui/icons/Add';
import People from '@material-ui/icons/People';

// Import actions/styles
import * as PostActions from '../../../actions/post';
import styles from './FeedPosterStyle';

// Component for FeedPoster (for posting to the feed)
export class FeedPoster extends React.Component {
    constructor(props) {
        super(props);

        // Bind functions
        this.submitPost = this.submitPost.bind(this);
        this.updateRep = this.updateRep.bind(this);
        this.updateMessage = this.updateMessage.bind(this);

        // Set default rep/message
        this.state = {
            rep: 5,
            message: '',
            messageError: false,
            selectError: false,
            repError: false
        };

        // Get an initial team (if applicable)
        const { teams } = this.props;
        if (teams && Object.keys(teams).length > 0) {
            this.state.team = teams[Object.keys(teams)[0]].id;
        } else {
            this.state.team = '';
        }
    }

    // Set state on change of input elements
    setInput(inputName, event) {
        this.setState({ [inputName]: event.target.value });
    }

    // Updates value of post message
    updateMessage(event) {
        // Set the value of message
        const message = event.target.value;
        this.setState({ message, messageError: false });
    }

    // Update value of rep
    updateRep(event) {
        // Set the field
        const rep = event.target.value;
        this.setState({ rep, repError: false });
    }

    // Performs submission of a post
    submitPost() {
        const { type, parentID, addPost } = this.props;
        const { message, rep, team } = this.state;
        let error = false;

        // Validate message and rep
        if (message === '') {
            this.setState({ messageError: true });
            error = true;
        }
        if (
            type === 'member' &&
            (rep === '' || !Number(rep) || Number(rep) <= 0)
        ) {
            this.setState({ repError: true });
            error = true;
        }
        // If validation failed, return
        if (error) {
            return;
        }
        // Do not post if no team is available
        if (type === 'home' && team === '') {
            return;
        }

        // Add the post
        addPost(type, parentID || team, { message, rep });
        // Clear the TextField
        this.setState({ message: '' });
    }

    render() {
        // Extract props
        const { classes, type, teams, posterMargin } = this.props;
        const { message, rep, team, repError, messageError } = this.state;

        // If the type is the home page, add a Select element to allow
        // the user to select the team that they want to post to
        const teamSelector =
            type === 'home' ? (
                <FormControl>
                    <Select
                        value={team}
                        onChange={e => this.setInput('team', e)}
                        displayEmpty
                    >
                        {/* Populate the Select with the name of each team
                            and the shortName of each team as value */}
                        {Object.keys(teams).map(teamName => {
                            const team = teams[teamName];
                            return (
                                <MenuItem value={team.id} key={team.id}>
                                    {team.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            ) : null;

        // Rep TextField for member pages
        const repSelector =
            type === 'member' ? (
                <FormControl>
                    <TextField
                        label="Give some reputation!"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <People />
                                </InputAdornment>
                            )
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        placeholder="Reputation points to share"
                        value={rep}
                        onChange={this.updateRep}
                        error={repError}
                    />
                </FormControl>
            ) : null;

        return (
            <Card className={!posterMargin ? classes.root : ''}>
                {/* Header */}
                <CardHeader
                    title={
                        <Typography variant="h6">
                            Start a new post
                        </Typography>
                    }
                />
                {/* Contents */}
                <CardContent className={classes.content}>
                    <Grid container spacing={16} className={classes.container}>
                        {/* Text to be posted */}
                        <Grid item>
                            <TextField
                                className={classes.text}
                                id="message"
                                placeholder={
                                    type === 'member'
                                        ? 'Leave a nice comment...'
                                        : 'What\'s happening...' // prettier-ignore
                                }
                                margin="normal"
                                multiline
                                fullWidth
                                onChange={this.updateMessage}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Create />
                                        </InputAdornment>
                                    )
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={message}
                                error={messageError}
                            />
                        </Grid>

                        <Grid container className={classes.selectable}>
                            {/* Various selector fields */}
                            <Grid item className={classes.selecters}>
                                {/* Populate the poster with different
                                    form inputs, depending on the type
                                    of the parent */}
                                {type === 'home' && teamSelector}
                                {type === 'member' && repSelector}
                            </Grid>

                            {/* Submit button */}
                            <Grid item>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={this.submitPost}
                                >
                                    <Add className={classes.addButton} />
                                    Post
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}

// Define props
FeedPoster.propTypes = {
    // Whether poster has top margin
    posterMargin: PropTypes.bool,
    // Type of parent
    type: PropTypes.string.isRequired,
    // ID of parent (if team/member)
    parentID: PropTypes.string,
    // Generic props
    classes: PropTypes.object.isRequired,
    teams: PropTypes.object,
    user: PropTypes.object.isRequired,
    // Function for adding posts
    addPost: PropTypes.func.isRequired
};
export default withRouter(
    withStyles(styles)(
        connect(
            null,
            PostActions
        )(FeedPoster)
    )
);
