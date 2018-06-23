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
                let results;
                let connection;
                if (props.dbConnects && props.dbConnects.length >0) {
                    for (let i = 0; i<props.dbConnects.length; i++) {
                        if (eachInstance.instanceName === props.dbConnects[i].instanceName) {
                            results = props.dbConnects[i].result;
                            connection = props.dbConnects[i].db
                        }
                    }
                }
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
                        results={results}
                        db={connection}
                    />
                } else {
                    return null;
                }
            })}

        </ReactCSSTransitionGroup>
    </div>
);


Connections.propTypes = {
    db: PropTypes.string,
    host: PropTypes.string,
    user: PropTypes.string,
    port: PropTypes.number,
    instance: PropTypes.string
};

export default Connections