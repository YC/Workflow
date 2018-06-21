import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/en-au';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

// Defines individual news items
export class NewsItem extends React.Component {
    render() {
        // Extract props
        const { item, shortName, name } = this.props;
        const { message, createdAt } = item;

        return (
            <React.Fragment>
                <Card>
                    <CardHeader
                        title={<Link to={'/teams/' + shortName}>{name}</Link>}
                        subheader={moment(createdAt).calendar()}
                    />
                    <CardContent>
                        <Typography paragraph>{message}</Typography>
                    </CardContent>
                </Card>
            </React.Fragment>
        );
    }
}

// Define props
NewsItem.propTypes = {
    item: PropTypes.object.isRequired,
    shortName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};
export default NewsItem;
