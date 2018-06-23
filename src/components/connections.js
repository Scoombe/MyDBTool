import React from "react";
import PropTypes from "prop-types";
import Instance from './instance';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Connections = props => (
    <div className="connections" style={{padding: '10px'}}>
        <ReactCSSTransitionGroup
            component="div"
            transitionName="drop"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
        >
            {props.instances.map((eachInstance, index) => {

                if (eachInstance.isConnected) {
                    return <Instance
                        host={eachInstance.host}
                        user={eachInstance.username}
                        port={eachInstance.port}
                        instanceName={eachInstance.instanceName}
                        connections={eachInstance.connections}
                        key={index}
                        onCloseInstance={props.onCloseInstance}
                        onCloseConnection={props.onCloseConnection}
                        onAskDB={props.onAskDB}
                        onMonitorUpdate={props.onMonitorUpdate}
                    />
                } else {
                    return null;
                }
            })}

        </ReactCSSTransitionGroup>
    </div>
);


Connections.propTypes = {
    instances: PropTypes.array,
    onCloseInstance: PropTypes.func.isRequired,
    onCloseConnection: PropTypes.func.isRequired,
    dbConnects: PropTypes.array,
    onAskDB: PropTypes.func.isRequired,
    onMonitorUpdate: PropTypes.func.isRequired
};

export default Connections