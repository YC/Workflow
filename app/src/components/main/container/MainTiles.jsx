import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

// material-ui imports
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';

// Component for Main (static) tiles on Sidebar
class MainTiles extends React.Component {
    constructor(props) {
        super(props);

        // Bind navigate function
        this.navigate = this.navigate.bind(this);
    }

    // Performs navigation to the given path
    navigate(path) {
        const { history } = this.props;
        history.push(path);
    }

    render() {
        return (
            <React.Fragment>
                {/* Home */}
                <ListItem button onClick={() => this.navigate('/')}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary="Home" />
                </ListItem>

                {/* Search */}
                <ListItem button onClick={() => this.navigate('/search')}>
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                    <ListItemText disableTypography primary="Search" />
                </ListItem>
            </React.Fragment>
        );
    }
}

// Define props
MainTiles.propTypes = {
    history: PropTypes.object.isRequired
};
export default withRouter(MainTiles);
