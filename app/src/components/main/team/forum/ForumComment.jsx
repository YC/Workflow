import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// Import components, helper functions and styling
import Avatar from '../../common/Avatar';
import { getMemberInitials, composeName } from '../../common/member';
import styles from './ForumThreadStyle';

// Defines a forum thread comment
export class ForumComment extends React.Component {
    render() {
        // Extract props
        const { thread, members, classes } = this.props;
        const { comments } = thread;

        return (
            <React.Fragment>
                {/* For each comment */}
                {comments.map(comment => {
                    let member = members[comment.memberID];
                    return (
                        <Grid
                            key={comment.id}
                            container
                            className={classes.commentContainer}
                            spacing={2}
                        >
                            {/* Display author avatar */}
                            <Grid item className={classes.commentItem}>
                                <Avatar
                                    className={classes.avatar}
                                    avatar={member.avatar}
                                >
                                    {getMemberInitials(member)}
                                </Avatar>
                            </Grid>
                            {/* Display author name and comment */}
                            <Grid item className={classes.commentItem}>
                                <Typography>
                                    {
                                        <Link
                                            to={'/members/' + member.username}
                                        >
                                            {composeName(member)}
                                        </Link>
                                    }
                                    {':'} &nbsp; {comment.message}
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                })}
            </React.Fragment>
        );
    }
}

// Define prop types
ForumComment.propTypes = {
    classes: PropTypes.object.isRequired,
    thread: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired
};
export default withStyles(styles)(ForumComment);
