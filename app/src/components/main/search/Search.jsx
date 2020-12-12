import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

import Feed from '../feed';
import MemberBox from '../team/member/MemberBox';
import { search } from '../../../actions/search';
import styles from './SearchStyle';

// Component for search
class Search extends React.Component {
    constructor(props) {
        super(props);
        // Initialise state and bind functions
        this.state = { queryError: false, query: '' };
        this.updateQuery = this.updateQuery.bind(this);
        this.search = this.search.bind(this);
    }

    // Updates state from input
    updateQuery(event) {
        this.setState({ query: event.target.value, queryError: false });
    }

    // Handles submission
    search() {
        const { searchFunc } = this.props;
        const { query } = this.state;

        // Validate query
        if (query === '') {
            this.setState({ queryError: true });
            return;
        }

        // Perform search
        searchFunc(query);
    }

    render() {
        const { search, members, teams, user, classes } = this.props;
        const { queryError } = this.state;

        return (
            <React.Fragment>
                <Helmet>
                    <title>Search</title>
                </Helmet>

                {/* Query box */}
                <Card>
                    <CardHeader
                        title={
                            <Typography variant="h6">
                                Perform a search
                            </Typography>
                        }
                    />
                    <CardContent className={classes.cardContent}>
                        <TextField
                            id="message"
                            placeholder="Search for a member or a post..."
                            margin="normal"
                            fullWidth
                            onChange={this.updateQuery}
                            error={queryError}
                        />
                        <Button color="secondary" onClick={this.search}>
                            <SearchIcon className={classes.searchIcon} />
                            Search
                        </Button>
                    </CardContent>
                </Card>

                {/* Display members (if applicable) */}
                {search && search.members && (
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <Typography variant="h4" className={classes.header}>
                            Members
                        </Typography>

                        {/* Depending on whether members have been found,
                                display a MemberBox component or some text to
                                indicate that there are no matches */}
                        {search.members.length > 0 ? (
                            <MemberBox members={search.members} />
                        ) : (
                            <Typography>No matching members found</Typography>
                        )}
                    </React.Fragment>
                )}

                {/* Display posts (if applicable) */}
                {search && search.posts && (
                    <React.Fragment>
                        <Divider className={classes.divider} />
                        <Typography className={classes.header} variant="h4">
                            Posts
                        </Typography>

                        {/* Depending on whether there are matching posts,
                            display either a disabled Feed component or some
                            text to indicate that there are no matches */}
                        {search.posts.length > 0 ? (
                            <Feed
                                disabled
                                members={members}
                                teams={teams}
                                posts={search.posts}
                                user={user}
                                type="home"
                            />
                        ) : (
                            <Typography>No matching posts found</Typography>
                        )}
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

// Map dispatch
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ searchFunc: search }, dispatch);
}
// Define props
Search.propTypes = {
    classes: PropTypes.object.isRequired,
    search: PropTypes.object,
    searchFunc: PropTypes.func.isRequired,
    teams: PropTypes.object,
    members: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
export default withStyles(styles)(
    connect(
        null,
        mapDispatchToProps
    )(Search)
);
