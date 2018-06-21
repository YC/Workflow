import React from 'react';
import PropTypes from 'prop-types';

// Component for Loading Block
class LoadingBlock extends React.Component {
    render() {
        // Extract styles from props
        const { width, height, marginBottom = 0 } = this.props;

        // Set div with specified width/height/margin
        // Note: styling this component inline is intentional and is justified
        // from a maintainability perspective (as opposed to having multiple
        // CSS/JSS rules for each different block)
        return (
            <div
                className={'loading'}
                style={{ width, height, marginBottom }}
            />
        );
    }
}

// Define props
LoadingBlock.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.number,
    marginBottom: PropTypes.number
};
export default LoadingBlock;
