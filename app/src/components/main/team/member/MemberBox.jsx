import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// material-ui imports
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

// Import avatar component and member helper functions
import Avatar from '../../common/Avatar';
import { getMemberInitials, composeName } from '../../common/member';

// Component for rendering multiple members
class MemberBox extends React.Component {
    // Performs navigation
    navigate(location) {
        const { history } = this.props;
        history.push(location);
    }

    render() {
        // Extract members from props
        const { members } = this.props;

        return (
            <List>
                {/* Render each member as list item */}
                {members.map(member => {
                    return (
                        <ListItem
                            key={member.id}
                            button
                            onClick={() =>
                                this.navigate('/members/' + member.username)
                            }
                        >
                            {/* Avatar */}
                            <ListItemAvatar>
                                <Avatar avatar={member.avatar}>
                                    {getMemberInitials(member)}
                                </Avatar>
                            </ListItemAvatar>
                            {/* Name of member */}
                            <ListItemText>
                                <Typography>{composeName(member)}</Typography>
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        );
    }
}

// Define props
MemberBox.propTypes = {
    history: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired
};
export default withRouter(MemberBox);
