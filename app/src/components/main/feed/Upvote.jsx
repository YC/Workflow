import React from 'react';
import PropTypes from 'prop-types';

// material-ui imports
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Forward from '@material-ui/icons/Forward';
import { withStyles } from '@material-ui/core/styles';

// Import loading component and styles
import LoadingBlock from './LoadingBlock';
import styles from './UpvoteStyle';

// Component for displaying post upvotes
export class Upvote extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state and bind functions
        this.state = {
            upvoted: false,
            count: 0,
            upvoteDisabled: false
        };
        this.getColour = this.getColour.bind(this);
        this.submitVote = this.submitVote.bind(this);
        this.setUpvoteState = this.setUpvoteState.bind(this);
    }

    // Change colour of button when clicked
    getColour(clicked) {
        return clicked ? 'secondary' : 'primary';
    }

    // Update the upvote state of the button
    setUpvoteState() {
        const { votes, userID } = this.props;

        // Update vote count
        this.setState({ count: votes.length });
        // If userID is in votes, then user has upvoted
        for (let id of votes) {
            if (id === userID) {
                this.setState({ upvoted: true });
                return;
            }
        }
        this.setState({ upvoted: false });
    }

    // Mount the component
    componentDidMount() {
        this.setUpvoteState();
    }

    // Recieve new props for component
    componentWillReceiveProps(newProps) {
        // Reset upvote state and re-enable vote button
        this.props = newProps;
        this.setState({ upvoteDisabled: false });
        this.setUpvoteState();
    }

    // Submits an upvote/downvote
    submitVote() {
        // Extract props
        const { type, parentID, postID, addVote } = this.props;
        // Submit vote
        addVote(type, parentID, postID, !this.state.upvoted);

        // Disable the button to prevent spamming
        this.setState({ upvoteDisabled: true });
    }

    // Render the button
    render() {
        // Get theme/styles
        const { classes, disabled, loaded } = this.props;
        const { upvoteDisabled } = this.state;
        return (
            <div>
                <Grid container>
                    {/* Upvote Button */}
                    <Grid item className="flexCenter">
                        <Button
                            disabled={disabled || upvoteDisabled}
                            variant="flat"
                            color={this.getColour(this.state.upvoted)}
                            className={classes.buttonStyle}
                            onClick={this.submitVote}
                        >
                            {/* Upvote Icon */}
                            <Forward className={classes.iconStyle} />
                        </Button>
                    </Grid>

                    {/* Display Upvote Counts */}
                    <Grid item className="flexCenter">
                        {loaded ? (
                            <Typography variant="body2">
                                {(this.state.count === 1 && '1 Upvote') ||
                                    this.state.count + ' Upvotes'}
                            </Typography>
                        ) : (
                            // If parent is loading, ensure that vote text
                            // is 'loading' also
                            <LoadingBlock width={70} height={19} />
                        )}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

// Declare required PropTypes
Upvote.propTypes = {
    // Whether parent is loaded
    loaded: PropTypes.bool,
    // Whether parent is disabled (used for display in Search component)
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    addVote: PropTypes.func.isRequired,
    // Votes array
    votes: PropTypes.array.isRequired,
    // Parent/user attributes
    type: PropTypes.string.isRequired,
    parentID: PropTypes.string.isRequired,
    postID: PropTypes.string.isRequired,
    userID: PropTypes.string.isRequired
};
export default withStyles(styles)(Upvote);
