import React from "react";
import PropTypes from "prop-types";

export default class DbModal extends React.Component {
    constructor(props) {
        super(props);
        this.onConnect = this.onConnect.bind(this);
    }


    onConnect(e) {
        e.preventDefault();
        let instanceName;
        if (e.target.instanceName.value === '') {
            instanceName = e.target.host.value;
        } else {
            instanceName = e.target.instanceName.value;
        }
        let err;

        if (e.target.host.value === '') {
            this.props.sendError('Error', 'MissingHost', 'Please enter a Host');
            err = 1;
        }
        if (e.target.username.value === '') {
            this.props.sendError('Error', 'MissingUsername', 'Please enter a User');
            err = 1;
        }
        if (e.target.password.value === '') {
            this.props.sendError('Warning', 'MissingPassword', 'Accounts without passwords are insecure.');
            err = 1;
        }
        if (err !== 1) {
            this.props.clearError('', 'MissingHost');
            this.props.clearError('', 'MissingUsername');
            this.props.clearError('', 'MissingPassword');

            this.props.onConnect({
                instanceName: instanceName,
                host: e.target.host.value,
                port: e.target.port.value,
                username: e.target.username.value,
                password: e.target.password.value
            });
        }


    }


    render() {


        return (
            <div style={{marginLeft: '20px'}}>

                <form onSubmit={this.onConnect}>
                    <div className="form-group row" style={{width: '100%'}}>
                        <label
                            className="col-form-label input-group-addon">Name</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control dark-modal-input"
                                name="instanceName"
                                placeholder="Name"
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{width: '100%'}}>
                        <label
                            className="col-form-label input-group-addon">Host</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control dark-modal-input"
                                name="host"
                                placeholder="Host"
                                onChange={() => this.props.clearError('', 'MissingHost')}
                            />
                        </div>


                    </div>
                    <div className="form-group row" style={{width: '100%'}}>
                        <label
                            className="col-form-label input-group-addon">Port</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control dark-modal-input"
                                name="port"
                                placeholder="Port"
                            />
                        </div>
                    </div>

                    <div className="form-group row" style={{width: '100%'}}>
                        <label htmlFor="db-user"
                               className="col-form-label input-group-addon">User</label>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control dark-modal-input"
                                name="username"
                                placeholder="User"
                                onChange={() => this.props.clearError('', 'MissingUsername')}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{width: '100%'}}>
                        <label htmlFor="db-pass"
                               className="col-form-label input-group-addon">Password</label>
                        <div style={{width: '71%'}}>
                            <input
                                type="password"
                                className="form-control dark-modal-input"
                                name="password"
                                placeholder="Password"
                                onChange={() => this.props.clearError('', 'MissingPassword')}
                            />
                        </div>
                    </div>


                    <div className="form-group row">
                        <input
                            type="submit"
                            className="btn btn-primary"
                            name="connect"
                            value="Connect"
                        />
                        <button
                            id="db-connect-cancel"
                            type="button"
                            className="btn btn-outline-secondary "
                            style={{marginLeft: '20px'}}
                            onClick={() => this.props.onActiveInstanceChange('', true, '')}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
                <div className="hr-divider">
                    <h3 className="hr-divider-content hr-divider-heading">
                    </h3>
                </div>

            </div>

        )
    }
}

DbModal.propTypes = {
    onConnect: PropTypes.func.isRequired,
    errors: PropTypes.array,
    sendError: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    onActiveInstanceChange: PropTypes.func.isRequired
};