import React from "react";
import PropTypes from "prop-types";
import ReactTable from 'react-table';
import 'react-table/react-table.css'


export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.setTableData = this.setTableData.bind(this);
        this.state = {
            data: this.setTableData(this.props.result)
        }
    }

    setTableData(result) {
        console.log(result);
        return result;
    }

    render() {
        let columns = [];
        let data = [];
        for (let key in this.props.result[0]) {
            columns.push({
                Header: key,
                accessor: key
            });
        }
        for (let i = 0; i < this.props.result.length; i++) {
            data.push(this.props.result[i]);
        }
        let length;
        if (data.length >= 10) {
            length = 10
        } else {
            length = this.props.result.length;
        }
        console.log(data);
        console.log(columns);
        return (
            <div>
                <ReactTable
                    data={data}
                    columns={columns}
                    pageSizeOptions={[length, 5, 10, 20, 25, 50, 100]}
                    defaultPageSize={length}

                />
            </div>
        )
    }

};



