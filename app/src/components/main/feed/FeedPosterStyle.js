// Style for Feed Poster component
const FeedPosterStyle = {
    // Root container
    root: {
        marginTop: 0
    },

    // Card content styling
    content: {
        maxWidth: 500,
        borderLeft: '5px solid #30677E'
    },

    // Card content container
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'
    },

    // Text Field styling
    text: {
        marginTop: 0,
        marginBottom: 2
    },

    // Dropdowns and post button container
    selectable: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 500,
        marginTop: 4
    },

    // Child of selectable
    selecters: {
        display: 'flex',
        justifyContent: 'center',
        marginLeft: 7
    },

    // Padding for 'add' sign in post button
    addButton: {
        paddingRight: 5
    }
};
export default FeedPosterStyle;
