import React from 'react';
import PropTypes from 'prop-types';

// material-ui imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// Custom table component imports
import {
    CustomTableCell,
    CustomTableRow,
    CustomTableHead
} from '../common/Table';

// Component for displaying redeemed items
export class Redeemed extends React.Component {
    render() {
        // Extract props
        const { redeemed, redeemables } = this.props;

        // Sort redeemed array by date
        redeemed.sort((a, b) => {
            return new Date(a.updatedAt) - new Date(b.updatedAt);
        });

        return (
            <Table>
                {/* Table headers */}
                <CustomTableHead>
                    <CustomTableRow>
                        <TableCell>Redeemable</TableCell>
                        <TableCell>Reputation</TableCell>
                        <TableCell>Status</TableCell>
                    </CustomTableRow>
                </CustomTableHead>
                {/* Table content */}
                <TableBody>
                    {/* For each redeemed item, display... */}
                    {redeemed.map(redeem => {
                        const linkedRedeemable =
                            redeemables[redeem.redeemableID];
                        return (
                            linkedRedeemable && (
                                <CustomTableRow key={redeem.id} hover={true}>
                                    {/* Name of item */}
                                    <CustomTableCell data-label="Redeemable">
                                        {linkedRedeemable.name}
                                    </CustomTableCell>

                                    {/* Rep used to redeem item */}
                                    <CustomTableCell data-label="Reputation">
                                        {redeem.rep}
                                    </CustomTableCell>

                                    {/* Current status of item */}
                                    <CustomTableCell data-label="Status">
                                        {redeem.status}
                                    </CustomTableCell>
                                </CustomTableRow>
                            )
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

// Define props
Redeemed.propTypes = {
    redeemables: PropTypes.object.isRequired,
    redeemed: PropTypes.array.isRequired
};
export default Redeemed;
