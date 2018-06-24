import React from "react";
import PropTypes from "prop-types";

class BlankSlot extends React.Component {
    render() {
        return (
            <div className="form-check-inline input-group mb-2 mr-sm-2">
                <button className="btn btn-outline-secondary empty-slot"
                        style={{float: 'top'}}>{this.props.slot}
                </button>
            </div>)
    }
}


BlankSlot.propTypes = {
    slot: PropTypes.number
};