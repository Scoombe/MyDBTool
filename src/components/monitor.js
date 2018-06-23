import React from "react";
import PropTypes from "prop-types";
import {Line} from 'react-chartjs'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Close from './close';
import Table from './table';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default class MonitorSchema extends React.Component {
    constructor(props) {
        super(props);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.updateCPU = this.updateCPU.bind(this);
        this.state = {
            snapshot: '',
            width: window.innerWidth - 120,
            running: true,
            timer: 0,
            lastTime: 0,
            runningQs: {
                cols: [],
                rows: []
            },
            data: {
                labels: [],

                datasets: []
            },
            options: {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,

                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth: 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve: true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension: 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot: true,

                //Number - Radius of each point dot in pixels
                pointDotRadius: 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius: 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill: true,


                //Boolean - Whether to horizontally center the label and point dot inside the grid
                offsetGridLines: false
            }

        }
    }

    updateDimensions() {
        this.setState({width: window.innerWidth - 120});

    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        let snapshot = setInterval(() => {
            ipcRenderer.send('snapshot', 'main');
        }, 2000);

        ipcRenderer.on('process-list', (event, arg) => {
            if (Array.isArray(arg)) {
                this.updateCPU(snapshot, arg);

            }

        });
    }

    updateCPU(snapshot, arg) {
        let processes = arg;
        /*
        'instance/CONNECT_INSTANCE',
        instanceName: 'Test',
        host: 'localhost',
        port:'3306',
        username:'root',
        password:'dev'
         */
        if (this.state.running) {
            const now = Date.now();
            let datasets = [];
            let labels = this.state.data.labels;
            if (this.state.data.datasets.length === 0) {
                for (let i = 0; i < processes.length; i++) {
                    datasets.push({
                        label: processes[i].pid || 'CPU',
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [processes[i].cpu]

                    })
                }
            } else if (this.state.data.labels.length === 30) {
                datasets = this.state.data.datasets;
                labels.shift();
                for (let i = 0; i < datasets.length; i++) {
                    datasets[i].data.shift();
                    for (let c = 0; c < processes.length; c++) {
                        if (datasets[i].label === processes[c].pid) {
                            let data = datasets[i].data;
                            data.push(processes[i].cpu);
                            datasets[i].data = data;
                        }
                    }
                }

            } else {
                datasets = this.state.data.datasets;
                for (let i = 0; i < datasets.length; i++) {
                    for (let c = 0; c < processes.length; c++) {
                        if (datasets[i].label === processes[c].pid) {
                            let data = datasets[i].data;
                            data.push(processes[i].cpu);
                            datasets[i].data = data;
                        }
                    }
                }

            }
            let timer = this.state.timer + 1;
            labels.push(timer);
            this.setState({
                snapshot: snapshot,
                lastTime: now,
                timer: timer,
                data: {
                    labels: labels,
                    datasets: datasets
                }

            });
        }


    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        clearInterval(this.state.snapshot);
    }

    render() {
        return (
            <div style={{margin: 5}}
                 className="tabs query">
                <div className="panel panel-default query-tab">
                    <Close onClose={this.props.onCloseConnection} action={true} instanceName={this.props.instanceName}
                           index={this.props.index}/>
                    <div className="panel-heading statcard statcard-outline-warning p-4 mb-2">
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
                </div>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="squish"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    <Line
                        data={this.state.data}
                        options={this.state.options}
                        width={this.state.width}
                        style={{width: this.state.width + 'px'}}
                        redraw
                    />
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="squish"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    <Table
                        result={this.props.result}
                    />
                </ReactCSSTransitionGroup>
            </div>
        )
    }
};


// this.state = {
//     width: window.innerWidth - 120,
//     runningQs: {
//         cols: [],
//         rows: []
//     },
//     data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//
//         datasets: [
//             {
//                 label: window.innerWidth - 120,
//                 fillColor: "rgba(220,220,220,0.2)",
//                 strokeColor: "rgba(220,220,220,1)",
//                 pointColor: "rgba(220,220,220,1)",
//                 pointStrokeColor: "#fff",
//                 pointHighlightFill: "#fff",
//                 pointHighlightStroke: "rgba(220,220,220,1)",
//                 data: [65, 59, 80, 81, 56, 55, 40]
//             },
//             {
//                 label: "My Second dataset",
//                 fillColor: "rgba(151,187,205,0.2)",
//                 strokeColor: "rgba(151,187,205,1)",
//                 pointColor: "rgba(151,187,205,1)",
//                 pointStrokeColor: "#fff",
//                 pointHighlightFill: "#fff",
//                 pointHighlightStroke: "rgba(151,187,205,1)",
//                 data: [28, 48, 40, 19, 86, 27, 90]
//             }
//         ]
//     },
//     options: {
//
//         ///Boolean - Whether grid lines are shown across the chart
//         scaleShowGridLines: true,
//
//         //String - Colour of the grid lines
//         scaleGridLineColor: "rgba(0,0,0,.05)",
//
//         //Number - Width of the grid lines
//         scaleGridLineWidth: 1,
//
//         //Boolean - Whether to show horizontal lines (except X axis)
//         scaleShowHorizontalLines: true,
//
//         //Boolean - Whether to show vertical lines (except Y axis)
//         scaleShowVerticalLines: true,
//
//         //Boolean - Whether the line is curved between points
//         bezierCurve: true,
//
//         //Number - Tension of the bezier curve between points
//         bezierCurveTension: 0.4,
//
//         //Boolean - Whether to show a dot for each point
//         pointDot: true,
//
//         //Number - Radius of each point dot in pixels
//         pointDotRadius: 4,
//
//         //Number - Pixel width of point dot stroke
//         pointDotStrokeWidth: 1,
//
//         //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
//         pointHitDetectionRadius: 20,
//
//         //Boolean - Whether to show a stroke for datasets
//         datasetStroke: true,
//
//         //Number - Pixel width of dataset stroke
//         datasetStrokeWidth: 2,
//
//         //Boolean - Whether to fill the dataset with a colour
//         datasetFill: true,
//
//
//         //Boolean - Whether to horizontally center the label and point dot inside the grid
//         offsetGridLines: false
//     }
//
// }