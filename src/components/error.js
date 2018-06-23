import React from "react";
import PropTypes from "prop-types";
import Close from './close';

const Error = (props) => {


    let errorClass;
    if (props.type === 'Warning') {
        errorClass = 'panel-heading statcard statcard-outline-danger p-4 mb-2';
    } else {
        errorClass = 'panel-heading statcard statcard-outline-danger statcard-danger p-4 mb-2';
    }

    return (
        <div style={{margin: 5}}
             className="tabs query">
            <div className="panel panel-default query-tab">
                <Close index={props.index} action={'error'} onClose={props.onClose}/>
                <div className={errorClass}>
                    <a style={{color: 'white'}}>
                        <h6 className="statcard-number panel-title">
                            {props.type}

                        </h6>
                        <span className="statcard-desc" style={{color: 'white'}}>{props.message}</span>

                    </a>
                </div>
            </div>

        </div>
    )

};
/*
message={error.message}
                            type={error.errorType}
                            onClose={clearError}
                            index={index}
 */
Error.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
};

export default Error;