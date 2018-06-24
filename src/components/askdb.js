import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Close from './close';
import Table from './table';

export default class AskDB extends React.Component {
    constructor(props) {
        super(props);
        this.onAsk = this.onAsk.bind(this);
        this.onKill = this.onKill.bind(this);
        this.onTimer = this.onTimer.bind(this);
        this.onEnterQuery = this.onEnterQuery.bind(this);
        this.running = this.running.bind(this);
        this.onClose = this.onClose.bind(this);
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

    onClose(e) {

        this.props.onCloseConnection(e.instanceName, e.index);
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
            connectionID: this.props.connectionID,
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
            <div style={{margin: 5}}
                 className="tabs query panel-collapse">
                <div className="panel panel-default query-tab">
                    <Close onClose={this.onClose} action={true} instanceName={this.props.instanceName}
                           index={this.props.index}/>
                    <div className="panel-heading statcard statcard-outline-primary p-4 mb-2">

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
                    {
                        (this.props.data && this.props.data.length >= 1)
                            ? this.props.data.map((tableData, index) => {
                                return (
                                    <ReactCSSTransitionGroup
                                        component="div"
                                        transitionName="squish"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={500}
                                        key={index}
                                    >
                                        <div className={'action-outline'}>
                                            <Table
                                                result={tableData.results}

                                            />
                                        </div>
                                    </ReactCSSTransitionGroup>
                                )
                            })
                            : null
                    }


                    <div>
                        <div>
                            <div
                                style={{minHeight: 80}} className="action-outline" contentEditable="true"
                                onInput={this.onEnterQuery}/>
                        </div>
                        <div className="btn-group">
                            {
                                this.state.running ?
                                    <button className="btn btn-outline-danger qbtn "

                                            onClick={this.onKill}> Kill
                                    </button>
                                    :
                                    <button className="btn btn-outline-success qbtn qbtn-run"
                                            onClick={this.onAsk}> Run
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
    connectionID: PropTypes.number,
    host: PropTypes.string,
    db: PropTypes.string,
    instanceName: PropTypes.string,
    onCloseConnection: PropTypes.func.isRequired,
    index: PropTypes.number,
    onAskDB: PropTypes.func.isRequired,

};