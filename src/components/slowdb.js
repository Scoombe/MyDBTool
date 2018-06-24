import React from "react";
import PropTypes from "prop-types";
import Close from './close';
import LineChart from './linechart';

const SlowDB = (props) => {
    return (
        <div style={{margin: 5}}
             className="tabs query">
            <div className="panel panel-default query-tab">
                <Close onClose={(e) => props.onCloseConnection(e.instanceName, e.index)} action={true}
                       instanceName={props.instanceName}
                       index={props.index}/>
                <div className="panel-heading statcard statcard-outline-info p-4 mb-2">
                    <a style={{color: 'white'}}>
                        <h6 className="statcard-number panel-title">
                            {props.db}
                            <small className="delta-indicator delta-positive"/>
                        </h6>
                        <span className="statcard-desc">{props.host}</span>
                        <span className="icon icon-hour-glass"
                              style={{display: 'none'}}/>

                    </a>
                </div>
            </div>
            <div className="statcard statcard-outline-info">
                <div className={'action-outline'}>
                    <LineChart/>
                </div>

            </div>
        </div>
    )

};
SlowDB.propTypes = {
    connectionID: PropTypes.number,
    host: PropTypes.string,
    db: PropTypes.string,
    instanceName: PropTypes.string,
    onCloseConnection: PropTypes.func.isRequired,
    index: PropTypes.number,
};
export default SlowDB