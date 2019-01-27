import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

// material-ui imports
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';

// Import component/helpers/styles
import Avatar from '../common/Avatar';
import { getMemberInitials, composeName } from '../common/member';
import styles from './FeedPostStyle';

// Component for feed comment
export class FeedComment extends React.Component {
    constructor(props) {
        super(props);

        // Inititialise state
        this.state = {
            message: '',
            messageError: false
        };
        // Bind functions
        this.submitComment = this.submitComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
    }

    // Performs submission of a comment
    submitComment() {
        // Extract props
        const { post, type, addComment, parentID } = this.props;
        const { message } = this.state;

        // Validate comment
        if (message === '') {
            this.setState({ messageError: true });
            return;
        }

        // Add the comment
        addComment(type, parentID, post.id, { message });
        // Reset text field
        this.setState({ message: '' });
    }

    // Syncs comment field with state.comment
    updateComment(event) {
        this.setState({ message: event.target.value, messageError: false });
    }

    render() {
        // Extract props
        const { members, post, disabled, classes } = this.props;
        const { messageError } = this.state;

        // Get and sort comments by date
        const comments = post.comments;
        comments.sort((a, b) => {
            return new Date(a.updatedAt) - new Date(b.updatedAt);
        });

        return (
            <CardContent>
                {/* Display each comment */}
                {comments.map(comment => {
                    let member = members[comment.memberID];
                    return (
                        <Grid
                            key={comment.id}
                            container
                            className={classes.commentContainer}
                            spacing={16}
                        >
                            {/* Avatar of author */}
                            <Grid item className={classes.commentItem}>
                                <Avatar
                                    className={classes.avatar}
                                    avatar={member.avatar}
                                >
                                    {getMemberInitials(member)}
                                </Avatar>
                            </Grid>
                            {/* Name of author and message */}
                            <Grid item className={classes.commentItem}>
                                {
                                    <Link to={'/members/' + member.username}>
                                        {composeName(member)}
                                    </Link>
                                }

                                {': ' + comment.message}
                            </Grid>
                        </Grid>
                    );
                })}

                {/* Add comment poster if not disabled */}
                {!disabled && (
                    <Grid container spacing={16}>
                        {/* Input text field */}
                        <Grid item>
                            <TextField
                                placeholder="Write a comment..."
                                value={this.state.message}
                                onChange={this.updateComment}
                                error={messageError}
                            />
                        </Grid>
                        {/* Submit button */}
                        <Grid item>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={this.submitComment}
                            >
                                <Add className={classes.addButton} />
                                Post
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </CardContent>
        );
    }
}

// Define props
FeedComment.propTypes = {
    // Whether component is disabled
    disabled: PropTypes.bool,
    // ID of parent
    parentID: PropTypes.string.isRequired,
    // The post
    post: PropTypes.object.isRequired,
    // Parent type
    type: PropTypes.string.isRequired,
    // Add comment function
    addComment: PropTypes.func.isRequired,
    // Generic props
    classes: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired
};
export default withStyles(styles)(FeedComment);
