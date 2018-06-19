import React from "react";
import PropTypes from "prop-types";
import SlotActive from './slotactive';
import Dropdown from './dropdown';
import SlotOptions from './slotoptions';
import Schemas from './schemas';


const Slot = props =>
    (
        <div className="form-check-inline input-group mb-2 mr-sm-2">
            <SlotActive
                onActiveInstanceChange={props.onActiveInstanceChange}
                active={props.active}
                slot={props.slot}
                showDetail={props.showDetail}
                index={props.index}
                instanceName={props.instanceName}
            />
            {
                props.showDetail && props.isConnected
                    ?
                    <Schemas
                        slot={props.slot}
                        schemas={props.schemas}
                        onSchemaChange={props.onSchemaChange}
                        clearError={props.clearError}
                        index={props.index}
                    />
                    : null
            }
            {
                props.showDetail && props.isConnected
                    ? <SlotOptions slotOptions={props.slotOptions}
                                   instanceName={props.instanceName} activeSchema={props.activeSchema}
                                   onCloseInstance={props.onCloseInstance} addNewConnection={props.addNewConnection}
                                   sendError={props.sendError} connection={props.connection}/>
                    : null
            }

        </div>
    );

Slot.propTypes = {
    slot: PropTypes.number.isRequired,
    showDetail: PropTypes.bool.isRequired,
    onActiveInstanceChange: PropTypes.func.isRequired,
    schemaSelect: PropTypes.string,
    onSchemaChange: PropTypes.func.isRequired,
    schemas: PropTypes.array.isRequired,
    slotOptions: PropTypes.array.isRequired
};

export default Slot;