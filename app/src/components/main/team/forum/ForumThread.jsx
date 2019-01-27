import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/en-au';

// material-ui imports
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Add from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';

// Import components, helpers, actions and styling
import Avatar from '../../common/Avatar';
import ForumComment from './ForumComment';
import { getMemberInitials, composeName } from '../../common/member';
import { addThreadComment } from '../../../../actions/team_forum';
import styles from './ForumThreadStyle';

// Defines a forum thread
export class ForumThread extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state and bind functions
        this.state = {
            messageError: false,
            message: ''
        };
        this.updateComment = this.updateComment.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    // Updates the comment field
    updateComment(event) {
        this.setState({ message: event.target.value, messageError: false });
    }

    // Submits the comment
    submitComment() {
        // Extract props/state
        const { thread, addThreadComment } = this.props;
        const { message } = this.state;

        // Validate message
        if (message === '') {
            this.setState({ messageError: true });
            return;
        }

        // Add the comment and reset the text field
        addThreadComment(thread.parentID, thread.id, { message });
        this.setState({ message: '' });
    }

    render() {
        // Extract props/state
        const { thread, members, classes } = this.props;
        const { message, messageError } = this.state;

        // Determine author of thread
        const author = members[thread.memberID];

        return (
            <ExpansionPanel>
                {/* Summary of thread */}
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container wrap="wrap">
                        <Grid item className={classes.info}>
                            {/* Container for items on left */}
                            <Grid
                                container
                                spacing={16}
                                wrap="wrap"
                                className={classes.propertiesContainer}
                            >
                                {/* Avatar */}
                                <Grid item classes={classes.infoItem}>
                                    <Avatar avatar={author.avatar}>
                                        {getMemberInitials(author)}
                                    </Avatar>
                                </Grid>
                                {/* Author name & time */}
                                <Grid
                                    item
                                    className={classes.authorTimeContainer}
                                >
                                    <Typography>
                                        {composeName(author)}
                                    </Typography>
                                    <Typography variant="h1">
                                        {moment(thread.createdAt).calendar()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Title of thread */}
                        <Grid item className={classes.title}>
                            <Typography variant="subtitle1">
                                {thread.title}
                            </Typography>
                        </Grid>
                    </Grid>
                </ExpansionPanelSummary>

                {/* Content of thread */}
                <ExpansionPanelDetails className={classes.detailsContainer}>
                    {/* Description of thread (if applicable) */}
                    <Typography
                        varient="h1"
                        className={classes.description}
                    >
                        {thread.description || 'No description given...'}
                    </Typography>

                    {/* Forum comments */}
                    <ForumComment thread={thread} members={members} />

                    {/* Components for adding forum comments */}
                    <Grid container spacing={16}>
                        <Grid item>
                            <TextField
                                placeholder="Write a comment..."
                                value={message}
                                onChange={this.updateComment}
                                error={messageError}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={this.submitComment}
                            >
                                <Add className={classes.buttonDecorator} />
                                Post
                            </Button>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return bindActionCreators({ addThreadComment: addThreadComment }, dispatch);
};
// Define prop types
ForumThread.propTypes = {
    classes: PropTypes.object.isRequired,
    thread: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    addThreadComment: PropTypes.func.isRequired
};
export default withStyles(styles)(
    connect(
        null,
        matchDispatchToProps
    )(ForumThread)
);
