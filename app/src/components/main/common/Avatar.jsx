import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

import { serverURL } from '../../../actions/connection';
import classNames from 'classnames';
import styles from './AvatarStyle';

// Displays an Avatar
class DisplayAvatar extends React.Component {
    render() {
        // Extract prop elements
        const { children, avatar, className, classes, ...other } = this.props;

        // If the avatar is a URL
        if (avatar && avatar !== '') {
            // Render avatar with src attribute and no children
            return (
                <Avatar
                    {...other}
                    className={className}
                    src={serverURL + avatar}
                />
            );
        } else {
            // If not, just render avatar with children
            return (
                <Avatar
                    className={classNames(classes.avatar, className)}
                    {...other}
                >
                    {children}
                </Avatar>
            );
        }
    }
}

// Define props
DisplayAvatar.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    avatar: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(DisplayAvatar);
