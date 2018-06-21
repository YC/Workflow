// Style for forum poster
const ForumPosterStyle = {
    // Text Field styling
    text: {
        '&:last-child': {
            marginBottom: 0
        },
        marginTop: 0,
        marginBottom: '.8em'
    },

    // Padding for Card content (Fields and submit button)
    content: {
        maxWidth: 500,
        borderLeft: '5px solid #30677E'
    },

    // Container of submit button
    selectable: {
        display: 'flex',
        maxWidth: 500,
        marginTop: 4,
        justifyContent: 'flex-end'
    },

    // Padding for 'add' sign in submit button
    buttonDecorator: {
        paddingRight: 5
    }
};
export default ForumPosterStyle;
