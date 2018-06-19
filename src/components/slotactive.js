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
    slot: PropTypes.number.isRequired,
    showDetail: PropTypes.bool.isRequired
};

export default SlotActive