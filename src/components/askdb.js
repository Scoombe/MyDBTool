import React from "react";
import PropTypes from "prop-types";
import Qtimer from './qtimer'
import Close from './close';

export default class AskDB extends React.Component {
    constructor(props) {
        super(props);
        this.onAsk = this.onAsk.bind(this);
        this.onKill = this.onKill.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.onEnterQuery = this.onEnterQuery.bind(this);
        this.running = this.running.bind(this);
        this.state = {
            running: false,
            timer: 0,
            lastTime: 0,
            query: ''
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.onTimer, 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    onTimer() {
        if (this.state.running) {
            const now = Date.now();
            this.setState({lastTime: now, timer: this.state.timer + (now - this.state.lastTime)});
        }
    }

    onEnterQuery(e) {
        this.setState({
            query: e.target.textContent
        })
    }

    running(isit) {
        return new Promise(resolve => {
            this.setState({running: isit, lastTime: Date.now()});
            resolve();
        })
    }

    onAsk() {
        this.running(true).then(() => this.props.onAskDB({
            instanceName: this.props.instanceName,
            schema: this.props.db,
            query: this.state.query
        })).then(() => this.running(false)).then(() => {
                clearInterval(this.interval);
            }
        ).catch(() => this.running(false));

    }

    onKill() {
        this.setState({running: false, timer: 0})
    }


    render() {
        return (
            <div id="instance-1" style={{margin: 5}}
                 className="tabs query panel-collapse">
                <div className="panel panel-default query-tab">
                    <Close onClose={this.props.onCloseConnection} action={true} instanceName={this.props.instanceName}
                           index={this.props.index}/>
                    <div className="panel-heading statcard statcard-outline-primary p-4 mb-2">
                        <Qtimer timer={this.state.timer}/>
                        <a style={{color: 'white'}}>
                            <h6 className="statcard-number panel-title">
                                {this.props.db}
                                <small className="delta-indicator delta-positive"/>
                            </h6>
                            <span className="statcard-desc">{this.props.host}</span>
                            <span className="icon icon-hour-glass"
                                  style={{display: 'none'}}/>

                        </a>
                    </div>
                    <div
                        className="panel-collapse">
                        <div>
                            <div
                                style={{minHeight: 50}} contentEditable="true" onInput={this.onEnterQuery}/>
                        </div>
                        <div className="btn-group">
                            {
                                this.state.running ?
                                    <button className="btn btn-outline-danger qbtn "
                                            data-schema="rostrvm4322_106" data-connection={1}
                                            onClick={this.onKill}> Kill
                                    </button>
                                    :
                                    <button className="btn btn-outline-success qbtn qbtn-run"
                                            data-schema="rostrvm4322_106" data-connection={1} onClick={this.onAsk}> Run
                                    </button>
                            }


                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


AskDB.propTypes = {
    db: PropTypes.string,
    host: PropTypes.string
};