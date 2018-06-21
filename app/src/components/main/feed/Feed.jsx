import React from 'react';
import PropTypes from 'prop-types';
import FeedPoster from './FeedPoster';
import FeedContent from './FeedContent';

// Component for Feed
export class Feed extends React.Component {
    render() {
        // Extract props
        const {
            user,
            parentID,
            teams,
            type,
            members,
            posts,
            disabled,
            posterMargin
        } = this.props;

        return (
            <React.Fragment>
                {/* Render the FeedPoster component when it's not the
                    user's own profile */}
                {parentID !== user.id &&
                    !disabled && (
                        <FeedPoster
                            posterMargin={posterMargin}
                            type={type}
                            parentID={parentID}
                            teams={teams}
                            user={user}
                        />
                    )}

                {/* The content (posts) of the feed */}
                <FeedContent
                    disabled={disabled}
                    type={type}
                    userID={user.id}
                    posts={posts}
                    teams={teams}
                    members={members}
                />
            </React.Fragment>
        );
    }
}

Feed.propTypes = {
    // Whether poster has top margin
    posterMargin: PropTypes.bool,
    // Whether poster is disabled
    disabled: PropTypes.bool,
    // Parent ID (can be undefined/null when on home page)
    parentID: PropTypes.string,
    // Type of parent
    type: PropTypes.string.isRequired,
    // Posts of Feed
    posts: PropTypes.array.isRequired,
    // Generic props
    teams: PropTypes.object,
    members: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
export default Feed;
