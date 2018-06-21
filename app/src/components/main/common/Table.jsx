import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

import styles from './TableStyle';

// Defines a responsive table row
function CustomTableRow(props) {
    // Split props into the component's children and 'other' props
    const { children, classes, ...other } = props;

    return (
        <TableRow className={classes.tr} {...other}>
            {children}
        </TableRow>
    );
}
CustomTableRow.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
const CustomTableRowWithStyles = withStyles(styles)(CustomTableRow);

// Defines a responsive table head
function CustomTableHead(props) {
    // Split props into the component's children and 'other' props
    const { children, classes, ...other } = props;

    return (
        <TableHead className={classes.thead} {...other}>
            {children}
        </TableHead>
    );
}
CustomTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
const CustomTableHeadWithStyles = withStyles(styles)(CustomTableHead);

// Defines a responsive table cell
function CustomTableCell(props) {
    // Split props into the component's children and 'other' props
    const { children, className, classes, ...other } = props;

    return (
        <TableCell className={classNames(classes.td, className)} {...other}>
            {children}
        </TableCell>
    );
}
CustomTableCell.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object
    ])
};
const CustomTableCellWithStyles = withStyles(styles)(CustomTableCell);

// Export defined table components
export {
    CustomTableRowWithStyles as CustomTableRow,
    CustomTableCellWithStyles as CustomTableCell,
    CustomTableHeadWithStyles as CustomTableHead
};
