import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

// Style related imports
import Typography from '@material-ui/core/Typography';
import AddPhotoAlternate from '@material-ui/icons/InsertPhoto';
import { withStyles } from '@material-ui/core/styles';
import styles from './AvatarUploadStyle';
import classNames from 'classnames';

// Member avatar component
class AvatarUpload extends React.Component {
    constructor(props) {
        super(props);
        // Set initial state and bind upload function
        this.state = {
            rejected: false,
            accepted: false
        };
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }

    // Handles image uploads
    handleImageUpload(files) {
        const { id, uploadAvatar } = this.props;
        if (!files || files.length === 0) {
            // If no valid files are received
            this.setState({ rejected: true, accepted: false });
        } else {
            // If a valid file is received, upload the file as the avatar
            uploadAvatar(id, files[0]);
            this.setState({ rejected: false, accepted: true });
        }
    }

    render() {
        const { classes } = this.props;
        const { rejected, accepted } = this.state;

        return (
            <Dropzone
                className={classes.dropzone}
                multiple={false}
                accept="image/png,image/jpeg,image/gif"
                onDrop={this.handleImageUpload}
            >
                {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                        <div
                            {...getRootProps()}
                            className={classNames(
                                classes.dropzone,
                                'dropzone',
                                { 'dropzone--isActive': isDragActive }
                            )}
                        >
                            <input {...getInputProps()} />
                            <AddPhotoAlternate className={classes.addPhoto} />
                            {/* Render inner status text */}
                            <Typography
                                variant="body2"
                                className={
                                    rejected ? classes.dropzoneReject : ''
                                }
                            >
                                {rejected && 'File format is invalid'}
                                {accepted && 'Your avatar has been sent'}
                                {!rejected && !accepted && 'Upload an avatar'}
                            </Typography>
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}

// Define props
AvatarUpload.propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    uploadAvatar: PropTypes.func.isRequired
};
export default withStyles(styles)(AvatarUpload);
