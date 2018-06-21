import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// material-ui imports
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { MuiThemeProvider } from '@material-ui/core/styles';

// Import theme and Avatar component
import theme from './TeamAvatarTheme';
import Avatar from '../common/Avatar';

// Component for team tiles on Sidebar
class TeamTiles extends React.Component {
    // Performs navigation to page of given team
    navigateTeam(team) {
        const { history } = this.props;
        history.push('/teams/' + team);
    }

    render() {
        // Extract teams from props
        const { teams } = this.props;

        // Do not render if teams are still loading
        if (!teams) {
            return null;
        }

        return (
            <React.Fragment>
                {/* Render avatar and name of each team in teams */}
                {Object.keys(teams).map(teamShortName => (
                    <ListItem
                        key={teamShortName}
                        button
                        onClick={() => this.navigateTeam(teamShortName)}
                    >
                        {/* Team Avatar */}
                        <MuiThemeProvider theme={theme}>
                            <ListItemAvatar>
                                <Avatar avatar={teams[teamShortName].avatar}>
                                    {teams[teamShortName].displayname}
                                </Avatar>
                            </ListItemAvatar>
                        </MuiThemeProvider>
                        {/* Name of team */}
                        <ListItemText
                            disableTypography
                            primary={teams[teamShortName].name}
                        />
                    </ListItem>
                ))}
            </React.Fragment>
        );
    }
}

// Define props
TeamTiles.propTypes = {
    teams: PropTypes.object,
    history: PropTypes.object
};
export default withRouter(TeamTiles);
