import * as InstanceActionTypes from '../actiontypes/instances';

import * as ErrorActionTypes from '../actiontypes/errors';

export const addError = (errorType, errorSubType, message) => {
    return {
        type: ErrorActionTypes.ADD_ERROR,
        errorType,
        errorSubType,
        message
    }
};

export const clearError = (index, errorSubType) => {
    return {
        type: ErrorActionTypes.CLEAR_ERROR,
        index,
        errorSubType
    }
};

export const connectInstance = (instanceName, host, port, username, password) => {
    return {
        type: InstanceActionTypes.CONNECT_INSTANCE,
        instanceName,
        host,
        port,
        username,
        password
    }
};

export const updateConnection = (instanceName, connectionID, data) => {
    return {
        type: InstanceActionTypes.UPDATE_CONNECTION,
        instanceName,
        connectionID,
        data
    }
};

export const disconnectInstance = instanceName => {
    return {
        type: InstanceActionTypes.DISCONNECT_INSTANCE,
        instanceName
    }
};

export const addConnection = (instanceName, connectionType, interval) => {
    return {
        type: InstanceActionTypes.ADD_CONNECTION,
        instanceName,
        connectionType,
        interval
    }
};

export const removeConnection = (instanceName, index) => {
    return {
        type: InstanceActionTypes.REMOVE_CONNECTION,
        instanceName,
        index
    }
};

export const activeInstanceChange = (instanceName, showDetail, index) => {
    return {
        type: InstanceActionTypes.ACTIVE_INSTANCE_CHANGE,
        instanceName,
        showDetail,
        index
    }
};

export const schemaChange = (index, activeSchema) => {
    return {
        type: InstanceActionTypes.SCHEMA_CHANGE,
        index,
        activeSchema

    }
};

export const getSchema = (schemas) => {
    return {
        type: InstanceActionTypes.GET_SCHEMA,
        schemas
    }
};
export const slotOptions = (options) => {
    return {
        type: InstanceActionTypes.SLOT_OPTIONS,
        options
    }
};
