// Defines container styles
// Styles sourced from https://material-ui-next.com/demos/drawers/

const drawerWidth = 240;
const DrawerStyle = theme => ({
    // Styles for outmost container
    root: {
        display: 'flex'
    },

    // Styles for AppBar component
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },

    // Additional styles for AppBar when it's open
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },

    // Ensure that the profile button stays at the top right
    profileButton: {
        marginLeft: 'auto',
        marginRight: theme.spacing.unit * 2
    },

    // Styling for drawer open icon
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
        '@media (max-width: 600px)': {
            marginLeft: 8,
            marginRight: 24
        }
    },

    // Hides the drawer open icon (3 horizontal lines) when the drawer is open
    hide: {
        display: 'none'
    },

    // Styles for drawer
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        height: '100%'
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9
        }
    },

    // Style for bar at top of drawer
    drawerBar: {
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'right',
        padding: '0 1em'
    },

    // Bottom margin for divider
    divider: {
        marginBottom: 2
    },

    // Style the content (page)
    content: {
        marginTop: '64px',
        minWidth: '60%',
        minHeight: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3
    }
});
export default DrawerStyle;
