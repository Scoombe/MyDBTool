import React from "react";
import PropTypes from "prop-types";
import RC2 from 'react-chartjs2';

export default class LineChart extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.myChart = this.refs['canvas'].getChart();
        this.myChart.height = 200
    }

    render() {
        return <RC2 ref='canvas' data={this.props.data} options={{
            maintainAspectRatio: false,
        }} type='line'/>;
    }
}