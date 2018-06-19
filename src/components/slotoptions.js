import React from "react";

export default class SlotOptions extends React.Component {
    constructor(props) {
        super(props);
        this.showOpts = this.showOpts.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.addNewQuery = this.addNewQuery.bind(this);
        this.addNewMonitor = this.addNewMonitor.bind(this);
        this.addNewWatcher = this.addNewWatcher.bind(this);
        this.state = {
            showOptions: false,
        }
    }

    showOpts() {
        if (this.props.activeSchema === '') {
            this.props.sendError('Warning', 'MissingSchema','Please select a Schema');
            this.setState({
                showOptions: false
            });
        } else if (!this.state.showOptions && this.props.activeSchema !== '') {
            this.setState({
                showOptions: true,
            });
        } else {
            this.setState({
                showOptions: false,
            });
        }
    }

    addNewQuery(e) {
        this.props.addNewConnection({instanceName: this.props.instanceName, connectionType:'query',connection:this.props.connection});
    }

    addNewMonitor(e) {
        this.props.addNewConnection({instanceName: this.props.instanceName, connectionType:'monitor',connection:this.props.connection});
    }

    addNewWatcher(e) {
        this.props.addNewConnection({instanceName: this.props.instanceName, connectionType:'slowWatcher',connection:this.props.connection});
    }

    disconnect(e) {
        this.props.onCloseInstance(this.props.instanceName);
    }

    render() {
        let displayOption;
        let chevOutline;
        if (this.state.showOptions) {
            displayOption = {display: true};
            chevOutline = 'btn btn-sm btn-success'
        } else {
            displayOption = {display: 'none'};
            chevOutline = 'btn btn-sm btn-outline-success';
        }

        return (
            <div className="btn-group">
                <button type="button"
                        className={chevOutline}
                        style={{borderRadius: 4}} onClick={this.showOpts}><span
                    className="icon icon-chevron-small-down" style={{textAlign: 'left'}}/>
                </button>

                <div className="dropdown-menu" style={displayOption} onMouseLeave={this.showOpts}>

                    {
                        this.props.slotOptions.map((eachOption) => {
                            switch (eachOption) {
                                case 'query':
                                    return <button className="dropdown-item"
                                                   onClick={this.addNewQuery} key={eachOption} value={eachOption}>Add
                                        new
                                        Query</button>;
                                case 'monitor':
                                    return <button className="dropdown-item"
                                                   onClick={this.addNewMonitor} key={eachOption} value={eachOption}>Add
                                        new Instance Monitor</button>;
                                case 'slowWatcher':
                                    return <button className="dropdown-item"
                                                   onClick={this.addNewWatcher} key={eachOption} value={eachOption}>Add
                                        new Slow Query Watcher</button>;
                                default:
                                    return null;
                            }

                        })


                    }

                    <div className="dropdown-divider"/>
                    <button className="dropdown-item" onClick={this.disconnect} value="disconnect">Disconnect</button>
                </div>

            </div>
        )
    }
}