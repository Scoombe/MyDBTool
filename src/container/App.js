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
        this.onAskDB = this.onAskDB.bind(this);
        this.getInstance = this.getInstance.bind(this);
        this.onMonitorUpdate = this.onMonitorUpdate.bind(this);
        this.state = {
            /*
            dbConnects: [
            {
            instanceName,
            db: connection
            }
            ]
             */
        }
    };

    onConnect(e) {
        // bind dispatch to the action creators
        const addError = bindActionCreators(InstanceActionCreators.addError, this.props.dispatch);
        const clearError = bindActionCreators(InstanceActionCreators.clearError, this.props.dispatch);
        const connectInstance = bindActionCreators(InstanceActionCreators.connectInstance, this.props.dispatch);
        const getSchema = bindActionCreators(InstanceActionCreators.getSchema, this.props.dispatch);
        const slotOptions = bindActionCreators(InstanceActionCreators.slotOptions, this.props.dispatch);
        // Create a new database connection object
        const connection = new Connection(e.host, e.port, e.username, e.password);
        connection.connect().then((conn) => {
            // Connect to the database then add the connection string data to the store
            return new Promise((resolve, reject) => {
                // Clear the connection Errors
                clearError('', 'ER_ACCESS_DENIED_ERROR');
                clearError('', 'ECONNREFUSED');
                clearError('', 'ENOENT');

                // CONNECT_INSTANCE action
                connectInstance(e.instanceName, e.host, e.port, e.username, e.password);
                resolve(conn);
            })

        }).then((rows) => {
                // Now Get the available Schemas
                return connection.getSchema()
            }
        ).then(schemas => {
            // Set the available schemas in the Store
            return new Promise((resolve, reject) => {
                getSchema(schemas);
                resolve(schemas)
            })

        }).then(options => {
            return new Promise((resolve, reject) => {
                // If the host is local, allow the use of the MySQL monitor
                if (e.host.indexOf('localhost') >= 0 || e.host.indexOf('127.0.0.1') >= 0) {
                    slotOptions(['query', 'monitor', 'slowWatcher'])
                } else {
                    // Otherwise only give option for Query and SlowWatcher
                    slotOptions(['query', 'slowWatcher']);
                }
                resolve(options);
            })

        }).catch((err) => {
            if (err.code === "ENOENT") {
                // No Such File or directory
                return addError('Error', err.code, `Failed to Connect: Can't find host ${e.host}:${e.port}`);
            } else if (err.code === 'ECONNREFUSED') {
                // Incorrect port
                return addError('Error', err.code, `Failed to Connect: Connection Refused ${e.host}:${e.port}`);
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                // Incorrect password/username combination
                return addError('Error', err.code, `${err.message}`);
            }
        });
        // add the connection object to the app state
        this.setState({
            dbConnects: [{
                instanceName: e.instanceName,
                db: connection
            }]
        })

    }

    onAskDB(e) {
        const addError = bindActionCreators(InstanceActionCreators.addError, this.props.dispatch);
        const updateConnection = bindActionCreators(InstanceActionCreators.updateConnection, this.props.dispatch);
        /*
        e.instanceName,
        e.schema,
        e.connectionID,
        e.query
         */
        return new Promise((resolve, reject) => {
            const {connection} = this.getConnection(e);
            connection.useSchema(e.schema).then((res) => connection.explain(e.query)).then((res) => {
                updateConnection(e.instanceName, e.connectionID, 'Explain', res[0]);
                resolve(res);

            }).then(() => connection.query(e.query)).then((res) => {
                updateConnection(e.instanceName, e.connectionID, 'Query', res);
                resolve()
            }).catch((err) => {
                addError('Error', err.code, err.message);
                reject(err);
            });
        });

    }

    onMonitorUpdate(e) {
        const addError = bindActionCreators(InstanceActionCreators.addError, this.props.dispatch);
        const updateConnection = bindActionCreators(InstanceActionCreators.updateConnection, this.props.dispatch);
        /*
        e.instanceName,
        e.schema,
        e.connectionID,
        e.processType,
        e.int
         */
        if (e.processType === 'ProcessList') {
            return new Promise((resolve, reject) => {
                const {connection} = this.getConnection(e);
                connection.useSchema(e.schema).then((res) => connection.processList(e.schema)).then((res) => {
                    updateConnection(e.instanceName, e.connectionID, e.processType, res, e.int);
                    resolve(res);
                }).catch((err) => {
                    addError('Error', err.code, `${err.message}`);
                })
            });
        } else if (e.processType === 'CPU') {
            return new Promise((resolve, reject) => {
                updateConnection(e.instanceName, e.connectionID, e.processType, e.data, e.int);
                resolve();

            }).catch((err) => {
                addError('Error', err.code, `${err.message}`);
            })
        }
    }

    getInstance(e) {
        // Get the instance from instanceName
        let instance;
        for (let i = 0; i < this.props.instances.length; i++) {
            if (e.instanceName === this.props.instances[i].instanceName) {
                instance = this.props.instances[i];
            }
        }
        return instance;
    }

    getConnection(e) {
        // get the connection object and the activeSchema from the instanceName
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
        console.log(e);
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
                return addConnection(e.instanceName, e.connectionType);
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
                        onAskDB={this.onAskDB}
                        onMonitorUpdate={this.onMonitorUpdate}
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