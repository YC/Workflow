// Member page styling
const MemberStyle = {
    // Container for keeping items inline
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },

    // Member avatar for profile page
    avatar: {
        // Edit the margins of the team bars/avatars
        width: 120,
        height: 120,
        fontSize: 45
    },

    // Keep align in row
    row: {
        display: 'flex',
        alignItems: 'center'
    },

    // Member name
    name: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left'
    },

    // Member header
    badgesHeader: {
        paddingBottom: '0'
    },

    // Card container for badges
    badgesCard: {
        marginTop: 25
    }
};
export default MemberStyle;
