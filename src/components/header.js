import React from 'react';
import PropTypes from "prop-types";
import Close from './close';
import DbModal from './dbmodal';
import Slots from './slots';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Header = props => (


    <div style={{padding: '10px'}}>
        <Close onClose={props.onClose}/>
        <h4 style={{float: 'right', padding: '25px'}}>Welshman's DBTool</h4>
        <Slots
            instances={props.instances}
            onActiveInstanceChange={props.onActiveInstanceChange}
            onSchemaChange={props.onSchemaChange}
            onCloseInstance={props.onCloseInstance}
            addNewConnection={props.addNewConnection}
            sendError={props.sendError}
            clearError={props.clearError}
        />
        <div className="hr-divider">
            <h3 className="hr-divider-content hr-divider-heading">
            </h3>
        </div>
        <ReactCSSTransitionGroup
            component="div"
            transitionName="slide"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
        >
            {
                props.connectedModal
                    ? <DbModal
                        onConnect={props.onConnect}
                        errors={props.errors}
                        sendError={props.sendError}
                        clearError={props.clearError}
                        onActiveInstanceChange={props.onActiveInstanceChange}
                    />
                    : null
            }
        </ReactCSSTransitionGroup>

    </div>

);

Header.propTypes = {
    instances: PropTypes.array,
    onSchemaChange: PropTypes.func.isRequired

};

export default Header;