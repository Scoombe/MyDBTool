import * as InstanceActionTypes from '../actiontypes/instances';
import * as ErrorActionTypes from "../actiontypes/errors";

const initialState = {
    connectModalTrue: true,
    activeSlot: 0,
    errors: [],
    instances: [
        {
            name: 1,
            instanceName: '',
            isConnected: false,
            detail: true,
            schemas: [],
            slotOptions: [],
            activeSchema: '',
            username: '',
            password: '',
            host: '',
            port: '',
            connections: []

        },
        {
            name: 2,
            instanceName: '',
            isConnected: false,
            detail: false,
            schemas: [],
            slotOptions: [],
            activeSchema: '',
            username: '',
            password: '',
            host: '',
            port: '',
            connections: []

        },
        {
            name: 3,
            instanceName: '',
            isConnected: false,
            detail: false,
            schemas: [],
            slotOptions: [],
            activeSchema: '',
            username: '',
            password: '',
            host: '',
            port: '',
            connections: []

        }
    ]
};

export default function Instance(state = initialState, action) {
    switch (action.type) {
        case InstanceActionTypes.CONNECT_INSTANCE:
            return {
                ...state,
                connectModalTrue: false,
                instances: state.instances.map((instance, index) => {
                    if (index === state.activeSlot) {
                        let instancename;
                        if (action.instanceName && action.instanceName !== '') {
                            instancename = action.instanceName;
                        } else {
                            instancename = action.host;
                        }
                        return {
                            ...instance,
                            isConnected: true,
                            instanceName: instancename,
                            host: action.host,
                            port: action.port,
                            username: action.username,
                            password: action.password
                        }
                    } else {
                        return instance;
                    }


                })
            };
        case InstanceActionTypes.DISCONNECT_INSTANCE:
            return {
                ...state,
                connectModalTrue: true,
                instances: state.instances.map((instance, index) => {
                    if (instance.instanceName === action.instanceName) {
                        return {
                            ...instance,
                            isConnected: false,
                            activeSchema: '',
                            connections: [],
                        }
                    } else {
                        return {
                            ...instance
                        }
                    }

                })
            };
        case InstanceActionTypes.ADD_CONNECTION:
            return {
                ...state,
                instances: state.instances.map((instance) => {
                    if (instance.instanceName === action.instanceName) {
                        let connections = [];
                        let i = 0;
                        for (i; i < instance.connections.length; i++) {
                            connections.push(instance.connections[i]);
                        }
                        connections.push({
                            id: connections.length + 1,
                            type: action.connectionType,
                            target: instance.activeSchema,
                            interval: action.interval
                        });
                        return {
                            ...instance,
                            connections: connections
                        }
                    } else {
                        return {...instance}
                    }
                })
            };
        case InstanceActionTypes.UPDATE_CONNECTION:
            return {
                ...state,
                instances: state.instances.map((instance) => {
                    if (instance.instanceName === action.instanceName) {
                        let connections = [];
                        let i = 0;

                        for (i; i < instance.connections.length; i++) {
                            if (instance.connections[i].id === action.connectionID) {
                                let {id, type, target, interval, data} = instance.connections[i];
                                if (data && data.length >= 0) {
                                    if (action.dataType === 'ProcessList') {
                                        data[1] = {dataType: action.dataType, results: action.data, id: action.int};
                                    } else if (action.dataType === 'CPU') {
                                        data[0] = {dataType: action.dataType, results: action.data, id: action.int};
                                    } else {
                                        data.push({dataType: action.dataType, results: action.data, id: action.int})
                                    }
                                } else {

                                    data = [{dataType: action.dataType, results: action.data, id: action.int}];

                                }
                                connections.push({
                                    id,
                                    type,
                                    target,
                                    interval,
                                    data: data
                                });
                            } else {
                                connections.push(instance.connections[i]);
                            }
                        }

                        return {
                            ...instance,
                            connections: connections
                        }
                    } else {
                        return {...instance}
                    }
                })
            };
        case InstanceActionTypes.REMOVE_CONNECTION:
            return {
                ...state,
                instances: state.instances.map((instance) => {
                    if (instance.instanceName === action.instanceName) {
                        return {
                            ...instance,
                            connections: instance.connections.filter((connection, index) => {
                                if (index === action.index) {
                                    return false;
                                } else {
                                    return connection;
                                }
                            })
                        }
                    } else {
                        return {
                            ...instance
                        }
                    }

                })
            };
        case InstanceActionTypes.ACTIVE_INSTANCE_CHANGE:
            return {
                ...state,
                activeSlot: action.index,
                connectModalTrue: action.showDetail && action.index !== '' && !state.instances[action.index].isConnected,
                instances: state.instances.map((instance, index) => {
                    // if (action.index = '' && action.instanceName === '') {
                    //     return {
                    //         ...instance,
                    //         detail: action.showDetail
                    //     }
                    // } else {
                    if (!action.showDetail) {
                        return {
                            ...instance,
                            detail: action.showDetail
                        }
                    } else if (index === action.index) {
                        return {
                            ...instance,
                            detail: action.showDetail
                        }
                    } else {
                        return {
                            ...instance,
                            detail: !action.showDetail
                        }
                    }
                    // }
                })
            };
        case InstanceActionTypes.SCHEMA_CHANGE:
            return {
                ...state,
                instances: state.instances.map((instance, index) => {
                    if (index === action.index) {
                        return {
                            ...instance,
                            activeSchema: action.activeSchema
                        }
                    } else {
                        return {
                            ...instance
                        }
                    }

                })
            };
        case InstanceActionTypes.GET_SCHEMA:
            return {
                ...state,
                instances: state.instances.map((instance, index) => {
                    if (index === state.activeSlot) {
                        return {
                            ...instance,
                            schemas: action.schemas
                        }
                    } else {
                        return {
                            ...instance
                        }
                    }

                })
            };
        case InstanceActionTypes.SLOT_OPTIONS:
            return {
                ...state,
                instances: state.instances.map((instance, index) => {
                    if (index === state.activeSlot) {
                        return {
                            ...instance,
                            slotOptions: action.options
                        }
                    } else {
                        return {
                            ...instance
                        }
                    }

                })
            };

        case ErrorActionTypes.ADD_ERROR:
            return {
                ...state,
                errors: [
                    ...state.errors,
                    {
                        errorType: action.errorType,
                        errorSubType: action.errorSubType,
                        message: action.message
                    }
                ]

            };
        case ErrorActionTypes.CLEAR_ERROR:
            if (action.errorSubType !== '' && action.index === '') {
                return {
                    ...state,
                    errors: state.errors.filter((error) => {
                        if (error.errorSubType === action.errorSubType) {
                            return false;
                        } else {
                            return error;
                        }
                    })
                }
            } else {
                return {
                    ...state,
                    errors: [
                        ...state.errors.slice(0, action.index),
                        ...state.errors.slice(action.index + 1)
                    ]
                };
            }
        default:
            return state;

    }
}