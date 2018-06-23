import React from "react";
import PropTypes from 'prop-types';

const SlotActive = props => {
    let Class;
    if (props.showDetail) {
        Class = "btn btn-outline-success active";
    } else {
        Class = "btn btn-outline-success";
    }
    return (
        <button className={Class}
                style={{float: 'top'}}
                onClick={() => props.onActiveInstanceChange(props.instanceName, !props.showDetail, props.index)}>{props.slot}
        </button>
    )

};

SlotActive.propTypes = {
    onActiveInstanceChange: PropTypes.func.isRequired,
    slot: PropTypes.number.isRequired,
    showDetail: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    instanceName: PropTypes.string.isRequired
};

export default SlotActive