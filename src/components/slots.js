import React from "react";
import PropTypes from "prop-types";
import Slot from './slot';


const Slots = props =>


    (
        <div className="form-group row">
            <div className="col-md-10">
                <div id="slots" className="btn-group btn-group-toggle" data-toggle="buttons"
                     style={{paddingTop: '25px'}}>
                    {props.instances.map((eachInstance, index) => {
                        return <Slot slot={eachInstance.name}
                                     isConnected={eachInstance.isConnected}
                                     showDetail={eachInstance.detail}
                                     onActiveInstanceChange={props.onActiveInstanceChange}
                                     onSchemaChange={props.onSchemaChange}
                                     schemas={eachInstance.schemas}
                                     slotOptions={eachInstance.slotOptions}
                                     connection={eachInstance.connection}
                                     instanceName={eachInstance.instanceName}
                                     onCloseInstance={props.onCloseInstance}
                                     addNewConnection={props.addNewConnection}
                                     activeSchema={eachInstance.activeSchema}
                                     sendError={props.sendError}
                                     clearError={props.clearError}
                                     index={index}
                                     key={eachInstance.name}/>
                    })}


                </div>
            </div>
        </div>
    );


Slots.propTypes = {
    schemaSelect: PropTypes.string,
    onActiveInstanceChange: PropTypes.func.isRequired,
    onSchemaChange: PropTypes.func.isRequired,
    instances: PropTypes.arrayOf(PropTypes.shape(
        {
            name: PropTypes.number.isRequired,

            isConnected: PropTypes.bool.isRequired,
            detail: PropTypes.bool.isRequired,
            schemas: PropTypes.arrayOf(
                PropTypes.string
            ),
            activeSchema: PropTypes.string,
            username: PropTypes.string,
            password: PropTypes.string,
            host: PropTypes.string,
            port: PropTypes.number
        }
    ))
};

Slots.defaultProps = {
    schemaSelect: "schemaSelect-1",
};

export default Slots;