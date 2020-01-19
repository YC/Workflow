import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Import components and actions
import ForumPoster from './ForumPoster';
import ForumThread from './ForumThread';
import { getMembers } from '../../../../actions/member';
import { fetchForum } from '../../../../actions/team_forum';

// Import forum
export class Forum extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state and bind function
        this.state = {};
        this.getUnretrievedMembers.bind(this);
    }

    // On mount
    componentDidMount() {
        // Reset retrieved status, if forum is missing from team
        const { team } = this.props;
        if (!team.threads) {
            this.setState({ postsRetrieved: false, membersRetrieved: false });
        }
    }

    // On update
    componentDidUpdate(prevProps, prevState, snapshot) {
        // Extract state/props
        const { postsRetrieved, membersRetrieved } = this.state;
        const { team, actions } = this.props;

        // Get forum posts, if they have not been retrieved
        if (!postsRetrieved) {
            actions.fetchForum(team.id, team.shortName);
            this.setState({ postsRetrieved: true });
        }

        // If team threads have not been retrieved yet
        if (!team.threads) {
            return;
        }

        // Get unretrieved members (if applicable)
        const unretrieved_members = this.getUnretrievedMembers();
        if (unretrieved_members.length > 0 && !membersRetrieved) {
            actions.getMembers(unretrieved_members);
            this.setState({ membersRetrieved: true });
        }

        // If navigating to another team, start anew
        if (this.props.team.id !== prevProps.team.id) {
            this.setState({ postsRetrieved: false, membersRetrieved: false });
        }
    }

    // Returns unretrieved members for all threads
    getUnretrievedMembers() {
        const { team, members } = this.props;

        // Extract members for every forum post and comment
        let unretrieved = [];
        for (const threadID of Object.keys(team.threads)) {
            // Get the thread
            const thread = team.threads[threadID];

            // Add author (if applicable)
            if (!members[thread.memberID]) {
                unretrieved.push(thread.memberID);
            }
            // Add comment authors (if applicable)
            for (const comment of thread.comments) {
                if (!members[comment.memberID]) {
                    unretrieved.push(comment.memberID);
                }
            }
        }
        return unretrieved;
    }

    render() {
        // Extract props
        const { team, members } = this.props;

        // If threads have not been retrieved
        if (!team.threads) {
            return null;
        }

        // Ensure that all members are retrieved
        if (this.getUnretrievedMembers().length !== 0) {
            return null;
        }

        // Get threads and sort by date
        const threads = Object.keys(team.threads).map(
            threadID => team.threads[threadID]
        );
        threads
            .sort((a, b) => {
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            })
            .reverse();

        return (
            <React.Fragment>
                {/* Define Forum Poster */}
                <ForumPoster teamID={team.id} />
                {/* Define Forum Threads */}
                {threads.map(thread => {
                    return (
                        <ForumThread
                            key={thread.id}
                            thread={thread}
                            team={team}
                            members={members}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}

// Bind imported actions
const matchDispatchToProps = function(dispatch) {
    return {
        actions: bindActionCreators(
            {
                getMembers: getMembers,
                fetchForum: fetchForum
            },
            dispatch
        )
    };
};
// Define props
Forum.propTypes = {
    team: PropTypes.object.isRequired,
    members: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};
export default connect(
    null,
    matchDispatchToProps
)(Forum);
