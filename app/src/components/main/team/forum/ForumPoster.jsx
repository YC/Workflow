import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// material-ui imports
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Create from '@material-ui/icons/Create';
import Add from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';

// Import styles/actions
import styles from './ForumPosterStyle';
import { addThread } from '../../../../actions/team_forum';

// Defines the component for posting to forum
export class ForumPoster extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state and bind functions
        this.state = {
            title: '',
            titleError: false,
            message: ''
        };
        this.updateTitle = this.updateTitle.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.submitThread = this.submitThread.bind(this);
    }

    // Updates the value of state.title
    updateTitle(event) {
        this.setState({ titleError: false, title: event.target.value });
    }
    // Updates the value of state.message
    updateMessage(event) {
        this.setState({ message: event.target.value });
    }
    // Submits the thread
    submitThread() {
        const { title, message } = this.state;
        const { teamID, addThread } = this.props;
        if (title === '') {
            this.setState({ titleError: true });
        }

        // Submit the thread
        addThread(teamID, { title, description: message });
        // Reset fields
        this.setState({ title: '', message: '' });
    }

    render() {
        // Extract styles from props
        const { classes } = this.props;
        const { title, message, titleError } = this.state;

        return (
            <Grid>
                <Card>
                    {/* Title */}
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Start a new thread
                            </Typography>
                        }
                    />
                    {/* Poster content */}
                    <CardContent className={classes.content}>
                        <Grid
                            container
                            spacing={16}
                            className={classes.container}
                        >
                            <Grid item>
                                {/* Thread name */}
                                <TextField
                                    className={classes.text}
                                    id="message"
                                    placeholder="Thread Name"
                                    margin="normal"
                                    multiline
                                    fullWidth
                                    onChange={this.updateTitle}
                                    error={titleError}
                                    value={title}
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
                                />
                                {/* Thread text/description */}
                                <TextField
                                    className={classes.text}
                                    id="message"
                                    placeholder="Description"
                                    margin="normal"
                                    multiline
                                    fullWidth
                                    onChange={this.updateMessage}
                                    value={message}
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
                                />
                            </Grid>
                            {/* Submit button (right aligned) */}
                            <Grid container className={classes.selectable}>
                                <Grid item>
                                    <Button
                                        variant="text"
                                        color="secondary"
                                        onClick={this.submitThread}
                                    >
                                        <Add
                                            className={classes.buttonDecorator}
                                        />
                                        Post
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators({ addThread: addThread }, dispatch);
};
// Define props
ForumPoster.propTypes = {
    teamID: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    addThread: PropTypes.func.isRequired
};
export default withStyles(styles)(
    connect(
        null,
        matchDispatchToProps
    )(ForumPoster)
);
