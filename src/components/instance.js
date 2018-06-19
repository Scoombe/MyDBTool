import React from "react";
import Close from './close';
import PropTypes from "prop-types";
import AskDB from './askdb';
import MonitorSchema from './monitor';
import SlowDB from './slowdb';

export default class Instance extends React.Component {
    constructor(props) {
        super(props);
        this.minConnections = this.minConnections.bind(this);
        this.state = {
            showConnections: true,
        };
    }

    minConnections() {
        this.setState({
            showConnections: !this.state.showConnections
        })
    }


    render() {
        return (
            <div className="connection">
                <Close instanceName={this.props.instanceName} onClose={this.props.onCloseInstance}/>
                <div className="statcard statcard-outline-secondary">
                    <div
                        className="panel-heading statcard p-4 mb-2 connect-head statcard-outline-success statcard-success"
                        onClick={this.minConnections}>
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
                                                connection={this.props.connection}
                                                onCloseConnection={this.props.onCloseConnection}
                                                index={index}
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
                                                connection={this.props.connection}
                                                onCloseConnection={this.props.onCloseConnection}
                                                index={index}
                                                results={this.props.results}
                                                key={eachConnection.id}
                                            />
                                        );
                                    case 'slowWatcher':
                                        return (
                                            <SlowDB
                                                connectionID={eachConnection.id}
                                                host={this.props.host}
                                                db={eachConnection.target}
                                                connection={this.props.connection}
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