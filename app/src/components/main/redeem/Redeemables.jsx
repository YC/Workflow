import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// material-ui imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import StarBorder from '@material-ui/icons/StarBorder';
// Custom table component imports
import {
    CustomTableCell,
    CustomTableHead,
    CustomTableRow
} from '../common/Table';

// Import style
import styles from './RedeemStyle';

// Component for Redeemables table
export class Redeemables extends React.Component {
    constructor(props) {
        super(props);
        // Bind function
        this.performRedeem = this.performRedeem.bind(this);
    }

    // Performs redemption
    performRedeem(redeemableID) {
        const { addRedeem } = this.props;
        let redeem = {
            redeemableID: redeemableID
        };
        addRedeem(redeem);
    }

    render() {
        // Extract props
        const { redeemables, classes, userRep } = this.props;

        return (
            <Table>
                {/* Table headers */}
                <CustomTableHead>
                    <CustomTableRow>
                        <TableCell>Redeemable</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Reputation Required</TableCell>
                        <TableCell>Redeem!</TableCell>
                    </CustomTableRow>
                </CustomTableHead>
                {/* Table content */}
                <TableBody>
                    {/* For each redeemable, display... */}
                    {Object.keys(redeemables).map(itemID => (
                        <CustomTableRow key={itemID} hover={true}>
                            {/* Name */}
                            <CustomTableCell data-label="Name">
                                {redeemables[itemID].name}
                            </CustomTableCell>

                            {/* Description */}
                            <CustomTableCell data-label="Description">
                                {redeemables[itemID].description}
                            </CustomTableCell>

                            {/* Amount of reputation required */}
                            <CustomTableCell
                                align="right"
                                data-label="Reputation"
                            >
                                {redeemables[itemID].rep}
                            </CustomTableCell>

                            {/* Redeem Button */}
                            <CustomTableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.redeem}
                                    onClick={() =>
                                        this.performRedeem(
                                            redeemables[itemID].id
                                        )
                                    }
                                    disabled={userRep < redeemables[itemID].rep}
                                >
                                    <StarBorder
                                        className={classes.redeemdecoration}
                                    />
                                    Redeem
                                </Button>
                            </CustomTableCell>
                        </CustomTableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

// Define props
Redeemables.propTypes = {
    userRep: PropTypes.number.isRequired,
    addRedeem: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    redeemables: PropTypes.object.isRequired
};
export default withStyles(styles)(Redeemables);
