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
            schemas: ['rostrvm4323_106', 'rostrvm4330_106', 'rostrvm_106', 'information_schema', 'mysql'],
            slotOptions: [],
            activeSchema: '',
            username: '',
            password: '',
            host: '',
            port: 0,
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
            port: 0,
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
            port: 0,
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
                            password: action.password,
                            connection: action.connection
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