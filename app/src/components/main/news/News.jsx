import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import NewsItem from './NewsItem';

// Defines component for News sidebar
export class News extends React.Component {
    render() {
        // Extract props
        const { teams } = this.props;

        // If teams are not initialised
        if (!teams) {
            return null;
        }

        // Get all news items
        const items = [];
        for (const teamShortName of Object.keys(teams)) {
            const team = teams[teamShortName];
            for (const item of team.newsItems) {
                items.push({ item, team });
            }
        }

        // When there are no news items, display text to indicate that
        // there are no news items
        if (items.length === 0) {
            return <Typography>There are no news items...</Typography>;
        }

        // Sort news items by date
        items
            .sort((a, b) => {
                return new Date(a.item.updatedAt) - new Date(b.item.updatedAt);
            })
            .reverse();

        return (
            <Grid>
                {/* Heading */}
                <Typography variant="title">Latest News</Typography>
                {/* News items */}
                {items.map(item => {
                    return (
                        <NewsItem
                            key={item.item.id}
                            item={item.item}
                            shortName={item.team.shortName}
                            name={item.team.name}
                        />
                    );
                })}
            </Grid>
        );
    }
}

// Define props
News.propTypes = {
    teams: PropTypes.object.isRequired
};
export default News;
