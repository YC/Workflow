// Style for forum threads
const ForumThreadStyle = {
    // Container for author/avatar/date
    // Adapted from https://stackoverflow.com/questions/33079997
    info: {
        flex: '0 0 auto',
        padding: '.3em 0',
        paddingRight: '2em'
    },

    // Container for title (in summary)
    title: {
        display: 'flex',
        flex: '1 1 auto',
        justifyContent: 'center',
        flexDirection: 'column'
    },

    // Container for author/avatar/date (under info)
    propertiesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    /* Container for author and time fields (under propertiesContainer) */
    authorTimeContainer: {
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Container for forum comments/comments poster
    detailsContainer: {
        display: 'inherit'
    },

    // Description spacing
    description: {
        paddingBottom: '1.5em'
    },

    // -----------------------------------------------------------------------
    // Comment container
    commentContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    // Centers comment items
    commentItem: {
        display: 'flex',
        alignItems: 'center'
    },

    // Padding for 'add' sign in submit button
    buttonDecorator: {
        paddingRight: 5
    }
};
export default ForumThreadStyle;
