// Defines feed post styling
const FeedPostStyle = {
    // Container of post (Card component)
    post: {
        marginTop: 25
    },

    // Post avatar styling
    avatar: {
        fontSize: 18,
        width: 43,
        height: 43
    },

    // Author name styling
    authorName: {
        '&:link,&:visited': {
            color: '#000'
        },
        '&:hover': {
            color: '#30677E'
        }
    },

    // The expander
    show: {
        marginBottom: 0
    },
    arrow: {
        transform: 'rotate(180deg)',
        display: 'inline'
    },

    // Comment container
    commentContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    // Style for comments header
    commentHeaderStyle: {
        paddingBottom: '0',
        marginLeft: 8,
        display: 'inline',
        marginBottom: '0'
    },

    // Centers comment items
    commentItem: {
        display: 'flex',
        alignItems: 'center'
    },

    // Padding for 'add' sign in comment button
    addButton: {
        paddingRight: 5
    }
};
export default FeedPostStyle;
