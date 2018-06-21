import React from 'react';
import PropTypes from 'prop-types';
import { ImageField, ImageInput } from 'react-admin';

// Define an avatar input field
const AvatarInput = ({ source, record = {} }) => {
    // If source is not 'avatar' or record.avatar is a string (rather than an
    // object containing the image), the field should not be displayed
    if (source !== 'avatar' || typeof record.avatar === 'string') {
        return null;
    }

    // Render ImageInput field with enclosed ImageField (for display image)
    return (
        <React.Fragment>
            <ImageInput source="avatar" accept="image/*" record={record}>
                <ImageField source="src" />
            </ImageInput>
        </React.Fragment>
    );
};

// Define props
AvatarInput.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired
};
export default AvatarInput;
