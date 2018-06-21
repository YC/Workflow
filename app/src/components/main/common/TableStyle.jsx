// Defines styles of responsive table
// Adapted from http://allthingssmitty.com/2016/10/03/responsive-table-layout/
const TableStyle = {
    // Table header
    thead: {
        '@media (max-width: 1050px)': {
            display: 'none'
        }
    },

    // Table row
    tr: {
        '@media (max-width: 1050px)': {
            borderBottom: '2px solid rgba(244, 244, 244, 1)'
        }
    },

    // Table cell
    td: {
        '@media (max-width: 1050px)': {
            display: 'block',
            borderBottom: '1px solid transparent',
            textAlign: 'right',
            paddingRight: '24px',
            margin: '6px 0',

            // Define cell label
            '&:before': {
                content: 'attr(data-label)',
                float: 'left',
                fontWeight: 'bold'
            }
        }
    }
};
export default TableStyle;
