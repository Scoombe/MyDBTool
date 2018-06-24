import React from "react";
import Close from './close';
import PropTypes from "prop-types";
import AskDB from './askdb';
import MonitorSchema from './monitor';
import SlowDB from './slowdb';

export default class Instance extends React.Component {
    constructor(props) {
        super(props);
        this.minInstance = this.minInstance.bind(this);
        this.state = {
            showConnections: true,
        };
    }

    minInstance() {
        this.setState({
            showConnections: !this.state.showConnections
        })
    }


    render() {
        return (
            <div className="connection">
                <Close instanceName={this.props.instanceName} onClose={this.props.onCloseInstance}/>
                <div className="statcard statcard-outline-secondary" >
                    <div
                        className="panel-heading statcard p-4 mb-2 connect-head statcard-outline-success statcard-success"
                        onClick={this.minInstance}>
                        <a style={{color: 'white'}}>
                            <h5 className="statcard-number panel-title">
                                {this.props.instanceName}
                                <small className="delta-indicator delta-positive"/>
                            </h5>
                            <span className="statcard-desc">
                                {this.props.user}
                                @{this.props.host}
                                :{this.props.port}
                                </span>
                        </a>
                    </div>
                    {(this.props.connections.length >= 1 && this.state.showConnections)
                        ? this.props.connections.map((eachConnection, index) => {
                            if (eachConnection) {
                                switch (eachConnection.type) {
                                    case 'query':
                                        return (
                                            <AskDB
                                                connectionID={eachConnection.id}
                                                host={this.props.host}
                                                db={eachConnection.target}
                                                instanceName={this.props.instanceName}
                                                onCloseConnection={this.props.onCloseConnection}
                                                index={index}
                                                onAskDB={this.props.onAskDB}
                                                data={eachConnection.data}
                                                key={eachConnection.id}
                                            />
                                        );
                                    case 'monitor':
                                        return (
                                            <MonitorSchema
                                                connectionID={eachConnection.id}
                                                host={this.props.host}
                                                db={eachConnection.target}
                                                instanceName={this.props.instanceName}
                                                onCloseConnection={this.props.onCloseConnection}
                                                index={index}
                                                onMonitorUpdate={this.props.onMonitorUpdate}
                                                data={eachConnection.data}
                                                key={eachConnection.id}
                                            />
                                        );
                                    case 'slowWatcher':
                                        return (
                                            <SlowDB
                                                connectionID={eachConnection.id}
                                                host={this.props.host}
                                                db={eachConnection.target}
                                                instanceName={this.props.instanceName}
                                                onCloseConnection={this.props.onCloseConnection}
                                                index={index}
                                                key={eachConnection.id}
                                            />
                                        );
                                    default:
                                        return false;
                                }
                            } else {
                                return false;
                            }

                        }) : null}
                </div>
            </div>
        )
    }
}

Instance.propTypes = {
    host: PropTypes.string,
    user: PropTypes.string,
    port: PropTypes.string,
    instanceName: PropTypes.string,
    connections: PropTypes.array,
    onCloseConnection: PropTypes.func.isRequired,
    onCloseInstance: PropTypes.func.isRequired,
    onAskDB: PropTypes.func.isRequired,
    onMonitorUpdate: PropTypes.func.isRequired
};