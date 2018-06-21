import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// material-ui imports
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

// Icon imports
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

// Actions/component/styles imports
import * as UserActions from '../../../actions/user';
import MainTiles from './MainTiles';
import TeamTiles from './TeamTiles';
import styles from './ContainerStyle';

// Container Component
export class Container extends React.Component {
    // Initialise state
    state = {
        anchorEl: null,
        open: false,
        title: 'Workflow'
    };

    // Component constructor
    constructor(props) {
        super(props);

        // Bind functions
        this.handleMenu = this.handleMenu.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Opens the menu and sets the anchor
    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
    }
    // Closes the menu by resetting the anchor
    handleClose() {
        this.setState({ anchorEl: null });
    }
    // Handles click event of logout menu item
    handleLogout() {
        const { history, userLogout } = this.props;
        userLogout();
        history.push('/auth/login');
    }

    // Drawer Functions
    handleDrawerOpen = () => {
        this.setState({ open: true });
    };
    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        // Avatar menu anchor
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        // Get theme/styles
        const { classes } = this.props;

        // Get user, children and theme
        const { user, children, teams } = this.props;

        return (
            <div className={classes.root}>
                {/* Update title on change
                Adapted from: https://stackoverflow.com/questions/47915906
                https://github.com/nfl/react-helmet/blob/master/src/Helmet.js
                */}
                <Helmet
                    onChangeClientState={newState =>
                        this.setState({ title: newState.title })
                    }
                />

                {/* Top bar */}
                <AppBar
                    position="absolute"
                    className={classNames(
                        classes.appBar,
                        this.state.open && classes.appBarShift
                    )}
                >
                    <Toolbar disableGutters={!this.state.open}>
                        {/* Hamburger icon for opening/closing drawer */}
                        <IconButton
                            color="inherit"
                            aria-owns={open ? 'menu-options' : null}
                            onClick={this.handleDrawerOpen}
                            className={classNames(
                                classes.menuButton,
                                this.state.open && classes.hide
                            )}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Page title text */}
                        <Typography variant="title" color="inherit" noWrap>
                            {document.title}
                        </Typography>

                        {/* User button at top right */}
                        <IconButton
                            className={classNames(classes.profileButton)}
                            color="inherit"
                            aria-owns={open ? 'menu-options' : null}
                            area-haspopup="true"
                            onClick={this.handleMenu}
                        >
                            <AccountCircle />
                        </IconButton>
                        {/* Menu for user button */}
                        <Menu
                            id="menu-options"
                            anchorEl={anchorEl}
                            open={open}
                            onClick={this.handleClose}
                            onClose={this.handleClose}
                        >
                            {/* Profile */}
                            <MenuItem
                                component={Link}
                                to={'/members/' + user.username}
                            >
                                Profile
                            </MenuItem>
                            {/* Redeem */}
                            <MenuItem component={Link} to="/me/redeem">
                                Redeem ({user.rep + ' rep'})
                            </MenuItem>
                            {/* Logout */}
                            <MenuItem
                                component={Link}
                                to="#"
                                onClick={this.handleLogout}
                            >
                                Log out
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Drawer/Sidebar */}
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(
                            classes.drawerPaper,
                            !this.state.open && classes.drawerPaperClose
                        )
                    }}
                    open={this.state.open}
                >
                    {/* Arrow for closing drawer */}
                    <div className={classes.drawerBar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />

                    {/* Primary/fixed tiles */}
                    <List onClick={this.handleDrawerClose}>
                        <MainTiles />
                    </List>
                    <Divider className={classes.divider} />

                    {/* Team tiles */}
                    <List
                        onClick={this.handleDrawerClose}
                        className={classes.listFormat}
                    >
                        <TeamTiles teams={teams} />
                    </List>
                </Drawer>

                {/* The page content */}
                <main className={classes.content}>{children}</main>
            </div>
        );
    }
}

// Define props
Container.propTypes = {
    history: PropTypes.object.isRequired,
    userLogout: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    teams: PropTypes.object
};
const WithStyles = withStyles(styles)(connect(null, UserActions)(Container));
export default withRouter(WithStyles);
