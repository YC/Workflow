import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment/locale/en-au';
import classnames from 'classnames';

// material-ui imports
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

// Component/helper/action/style imports
import LoadingBlock from './LoadingBlock';
import Avatar from '../common/Avatar';
import { getMemberInitials, composeName } from '../common/member';
import * as PostActions from '../../../actions/post';
import styles from './FeedPostStyle';

// Import upvote and comment components
import Upvote from './Upvote';
import FeedComment from './FeedComment';

// Component for feed post
export class FeedPost extends React.Component {
    constructor(props) {
        super(props);

        // Inititialise state
        this.state = {
            expanded: false,
            message: '',
            messageError: false
        };
        // Bind expand function
        this.handleExpandClick = this.handleExpandClick.bind(this);
    }

    // Expand comment button when triggered
    handleExpandClick() {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        // Extract props
        const {
            members,
            post,
            team,
            type,
            parentID,
            actions,
            userID,
            disabled,
            classes
        } = this.props;

        // Check whether participants of the post have been loaded
        let loaded = true;
        // Check whether author is loaded
        if (!members[post.memberID]) {
            loaded = false;
        }
        // Check whether authors of comments are loaded
        for (let comment of post.comments) {
            if (!members[comment.memberID]) {
                loaded = false;
            }
        }

        // Get post author
        let author = members[post.memberID];
        return (
            <Card className={classes.post}>
                {/* Display author and date information */}
                <CardHeader
                    avatar={
                        loaded ? (
                            // Author avatar
                            <Link to={'/members/' + author.username}>
                                <Avatar
                                    className={classes.avatar}
                                    avatar={author.avatar}
                                >
                                    {getMemberInitials(author)}
                                </Avatar>
                            </Link>
                        ) : (
                            // Display blank avatar if post has not been loaded
                            <Avatar className={classes.avatar} />
                        )
                    }
                    title={
                        loaded ? (
                            // Author name
                            <Link
                                to={'/members/' + author.username}
                                className={classes.authorName}
                            >
                                {composeName(author)}
                            </Link>
                        ) : (
                            // Display loading name block if not loaded
                            <LoadingBlock width={135} height={27} />
                        )
                    }
                    subheader={
                        loaded ? (
                            // Date/team information
                            <Typography variant="h1">
                                {moment(post.createdAt).calendar()}
                                {type === 'home' && (
                                    // If on home page, show team selector
                                    <React.Fragment>
                                        <span>{' - '}</span>
                                        <Link to={'/teams/' + team.shortName}>
                                            {team.name}
                                        </Link>
                                    </React.Fragment>
                                )}
                            </Typography>
                        ) : (
                            // Display loading block if not loadeds
                            <LoadingBlock width={200} height={13} />
                        )
                    }
                />

                {/* Message of post */}
                <CardContent>
                    {loaded ? (
                        <Typography paragraph>{post.message}</Typography>
                    ) : (
                        // Display loading block if not loaded
                        <LoadingBlock
                            width={'50%'}
                            height={20}
                            marginBottom={16}
                        />
                    )}
                </CardContent>

                {/* Upvote component */}
                <Upvote
                    disabled={disabled}
                    type={type}
                    postID={post.id}
                    votes={post.upvotes}
                    parentID={parentID}
                    addVote={actions.addVote}
                    userID={userID}
                    loaded={loaded}
                />

                {/* Expand button/text for comments */}
                <CardActions disableSpacing>
                    <IconButton
                        className={classnames({
                            [classes.arrow]: this.state.expanded
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <Typography
                        paragraph
                        variant="body2"
                        className={classes.show}
                    >
                        Show Comments
                    </Typography>
                </CardActions>

                {/* Render comments component */}
                <Collapse
                    in={this.state.expanded}
                    timeout="auto"
                    unmountOnExit
                    arrow="true"
                >
                    {loaded ? (
                        <FeedComment
                            disabled={disabled}
                            parentID={parentID}
                            post={post}
                            type={type}
                            addComment={actions.addComment}
                            members={members}
                        />
                    ) : (
                        <Typography>Comments are still loading</Typography>
                    )}
                </Collapse>
            </Card>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return {
        actions: bindActionCreators(PostActions, dispatch)
    };
};
// Define props
FeedPost.propTypes = {
    // Whether component is disabled
    disabled: PropTypes.bool,
    // ID of parent
    parentID: PropTypes.string.isRequired,
    // Team (if applicable)
    team: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    // The post
    post: PropTypes.object.isRequired,
    // Parent type
    type: PropTypes.string.isRequired,
    // ID of user
    userID: PropTypes.string.isRequired,
    // Generic props
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired
};
export default withStyles(styles)(
    connect(
        null,
        matchDispatchToProps
    )(FeedPost)
);
