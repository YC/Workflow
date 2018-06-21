import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'react-admin';

// Define an avatar field
const AvatarField = ({ source, record = {} }) => {
    if (typeof record.avatar === 'string') {
        // If the field is a string, then display by passing on record/source
        // It could be an object when the avatar has just been submitted
        return <TextField source={source} record={record} />;
    } else {
        // If field is not a string, display nothing
        return null;
    }
};

// Define props
AvatarField.propTypes = {
    record: PropTypes.object,
    source: PropTypes.string.isRequired
};
export default AvatarField;
