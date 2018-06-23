import React from "react";
import PropTypes from 'prop-types';

export default class Close extends React.Component {
    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
    }

    onClose() {

        if (this.props.action === true) {
            this.props.onClose({
                    instanceName: this.props.instanceName,
                    index: this.props.index
                }
            );
        } else if (this.props.action === 'error') {
            this.props.onClose(this.props.index, '');

        } else {
            this.props.onClose(this.props.instanceName);
        }
    }

    render() {
        return (
            <button type="button" className="btn btn-xs btn-danger clear-query"
                    style={{float: 'right', margin: 10, marginTop: '30px'}} onClick={this.onClose}>
                <span className="icon icon-cross"/>
            </button>
        )
    }
};

Close.propTypes = {
    onClose: PropTypes.func.isRequired,
    index: PropTypes.number,
    instanceName: PropTypes.string
};

