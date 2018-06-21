// Import post related actions
import * as MemberActions from './member';
import * as TeamActions from './team';

// Generic post adding function - triggers the post adding action
// of the appropriate entity (identified by type)
export const addPost = (type, entity, post) => dispatch => {
    if (type === 'team' || type === 'home') {
        return dispatch(TeamActions.addPost(entity, post));
    } else if (type === 'member') {
        return dispatch(MemberActions.addPost(entity, post));
    }
};

// Generic upvote (addition/removal) function - triggers the upvote adding
// action of the appropriate entity
export const addVote = (type, entity, postID, vote) => dispatch => {
    if (type === 'team' || type === 'home') {
        if (vote) {
            // If vote is true, dispatch upvote
            return dispatch(TeamActions.addUpvote(entity, postID));
        } else {
            // Otherwise, dispatch removal of upvote
            return dispatch(TeamActions.removeUpvote(entity, postID));
        }
    } else if (type === 'member') {
        if (vote) {
            return dispatch(MemberActions.addUpvote(entity, postID));
        } else {
            return dispatch(MemberActions.removeUpvote(entity, postID));
        }
    }
};

// Generic comment adding function - triggers the comment adding action
// of the appropriate entity
export const addComment = (type, entity, postID, comment) => dispatch => {
    if (type === 'team' || type === 'home') {
        return dispatch(TeamActions.addTeamComment(entity, postID, comment));
    } else if (type === 'member') {
        return dispatch(
            MemberActions.addMemberComment(entity, postID, comment)
        );
    }
};
