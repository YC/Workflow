// Dropzone style adapted from:
// https://github.com/marmelab/react-admin/blob/master/packages/ra-ui-materialui/src/input/ImageInput.js

// Defines style of Dropzone
const AvatarUploadStyle = {
    // Dropzone styling
    dropzone: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '50px',
        margin: '1.2em 0',
        background: '#efefef',
        cursor: 'pointer',
        padding: '1em 0',
        textAlign: 'center',
        color: '#999'
    },

    // Colour of inner text on Dropzone rejection
    dropzoneReject: {
        color: '#e57373'
    },

    // Style of the Button icon
    addPhoto: {
        paddingRight: '0.4em'
    }
};
export default AvatarUploadStyle;
