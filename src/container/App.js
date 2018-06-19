import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as InstanceActionCreators from '../actions/instances';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import '../app.css';
import Connection from '../db/dbconnect_class';
import Header from '../components/header'
import Connections from '../components/connections'
import Error from '../components/error'
import PropTypes from "prop-types";

const electron = window.require('electron');

const ipcRenderer = electron.ipcRenderer;


class Application extends React.Component {
    constructor(props) {
        super(props);
        this.onConnect = this.onConnect.bind(this);
        this.onClose = this.onClose.bind(this);
        this.interceptAddConnection = this.interceptAddConnection.bind(this);
        this.getConnection = this.getConnection.bind(this);
        this.state = {
            connection: {},
        }
    };

    onConnect(e) {
        const addError = bindActionCreators(InstanceActionCreators.addError, this.props.dispatch);
        const connectInstance = bindActionCreators(InstanceActionCreators.connectInstance, this.props.dispatch);
        const getSchema = bindActionCreators(InstanceActionCreators.getSchema, this.props.dispatch);
        const slotOptions = bindActionCreators(InstanceActionCreators.slotOptions, this.props.dispatch);
        const connection = new Connection(e.host, e.port, e.username, e.password);
        connection.connect().then((conn) => {
            return new Promise((resolve, reject) => {
                connectInstance(e.instanceName, e.host, e.port, e.username, e.password, conn);
                resolve(conn);
            })

        }).then((rows) => {
                return connection.getSchema()
            }
        ).then(schemas => {
            return new Promise((resolve, reject) => {
                getSchema(schemas);
                resolve(schemas)
            })

        }).then(options => {
            return new Promise((resolve, reject) => {
                if (e.host.indexOf('localhost') >= 0 || e.host.indexOf('127.0.0.1') >= 0) {
                    slotOptions(['query', 'monitor', 'slowWatcher'])
                } else {
                    slotOptions(['query', 'slowWatcher']);
                }
                resolve(options);
            })

        }).catch((err) => {
            if (err.code === "ENOENT") {
                return addError('Error', err.code, `Failed to Connect: Can't find host ${e.host}:${e.port}`);
            } else if (err.code === 'ECONNREFUSED') {
                return addError('Error', err.code, `Failed to Connect: Connection Refused ${e.host}:${e.port}`);
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                return addError('Error', err.code, `${err.message}`);
            }
        });
        this.setState({
            dbConnects: [{
                instanceName: e.instanceName,
                db: connection
            }]
        })

    }

    getConnection(e) {
        let activeSchema;
        let connection;
        for (let i = 0; i < this.state.dbConnects.length; i++) {
            if (e.instanceName === this.state.dbConnects[i].instanceName) {
                activeSchema = this.props.instances[i].activeSchema;
                connection = this.state.dbConnects[i].db
            }
        }

        return {activeSchema: activeSchema, connection: connection};
    }

    interceptAddConnection(e) {

        const {activeSchema, connection} = this.getConnection(e);

        const addConnection = bindActionCreators(InstanceActionCreators.addConnection, this.props.dispatch);
        const addError = bindActionCreators(InstanceActionCreators.addError, this.props.dispatch);
        switch (e.connectionType) {
            case 'query':
                connection.useSchema(activeSchema)
                    .then((res) => {
                    }).catch((err) => {
                    addError('Error', err.code, `${err.message}`);
                });
                return addConnection(e.instanceName, e.connectionType);
            case 'monitor':
                let int = setInterval(() => {
                    connection.useSchema(activeSchema).then((res) => connection.processList(activeSchema)).then((res) => {
                        this.setState({
                            dbConnects: this.state.dbConnects.map((connection, index) => {
                                if (connection.instanceName === e.instanceName) {
                                    return {
                                        ...connection,
                                        results: res,
                                    }
                                } else {
                                    return {
                                        ...connection
                                    }
                                }
                            })
                        })
                    }).catch((err) => {
                        addError('Error', err.code, `${err.message}`);
                    })
                }, 3000);
                return addConnection(e.instanceName, e.connectionType, int);
            case 'slowWatcher':
                return addConnection(e.instanceName, e.connectionType);
        }
    }


    onClose() {
        ipcRenderer.send('close-req', 'main');
    }


    render() {

        const {dispatch, appState, errors, instances} = this.props;
        const addError = bindActionCreators(InstanceActionCreators.addError, dispatch);
        const clearError = bindActionCreators(InstanceActionCreators.clearError, dispatch);

        const disconnectInstance = bindActionCreators(InstanceActionCreators.disconnectInstance, dispatch);

        const removeConnection = bindActionCreators(InstanceActionCreators.removeConnection, dispatch);
        const activeInstanceChange = bindActionCreators(InstanceActionCreators.activeInstanceChange, dispatch);
        const schemaChange = bindActionCreators(InstanceActionCreators.schemaChange, dispatch);

        let error;
        if (errors) {
            error = errors.map((error, index) => {
                if (error.message) {
                    return (
                        <Error
                            message={error.message}
                            type={error.errorType}
                            onClose={clearError}
                            index={index}
                            key={index}
                        />
                    )
                } else {
                    return false;
                }

            });
        }


        return (
            <div>
                <div style={{padding: '10px'}}>
                    <Header
                        instances={instances}
                        connectedModal={appState.connectModalTrue}
                        onActiveInstanceChange={activeInstanceChange}
                        onConnect={this.onConnect}
                        onSchemaChange={schemaChange}
                        onCloseInstance={disconnectInstance}
                        addNewConnection={this.interceptAddConnection}
                        sendError={addError}
                        clearError={clearError}
                        errors={errors}
                        onClose={this.onClose}
                    />
                    <ReactCSSTransitionGroup
                        component="div"
                        transitionName="slide"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        {error}
                    </ReactCSSTransitionGroup>
                    <Connections
                        instances={instances}
                        onCloseInstance={disconnectInstance}
                        onCloseConnection={removeConnection}
                        dbConnects={this.state.dbConnects}
                    />
                </div>

            </div>
        );
    }

}

const mapStateToProps = state => (
    {
        appState: {
            connectModalTrue: state.connectModalTrue,
            activeSlot: state.activeSlot
        },
        errors: state.errors,
        instances: state.instances
    }
);


Application.propTypes = {
    // can set up specific types for each imported property and isRequired makes sure that its included
    // title: PropTypes.string.isRequired,
    title: PropTypes.string,
    appState: PropTypes.object

};

Application.defaultProps = {
    title: "DBTool"
};


// ReactDOM.render(
//     <Application/>
//     , document.getElementById('container'));


export default connect(mapStateToProps)(Application);