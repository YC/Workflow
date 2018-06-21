import React from 'react';
import PropTypes from 'prop-types';

// Defines a centered grid
class GridCenter extends React.Component {
    render() {
        // Extract children from props
        const { children } = this.props;
        return (
            <div className="centeredFlexContainer">
                <div className="centeredFlexItem">{children}</div>
            </div>
        );
    }
}

// Adapted from: https://github.com/taion/react-router-scroll/issues/88
GridCenter.propTypes = {
    // Children can be array of nodes, a single node or a string
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string
    ]).isRequired
};
export default GridCenter;
