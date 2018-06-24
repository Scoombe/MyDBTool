import React from "react";
import PropTypes from "prop-types";
import ReactTable from 'react-table';
import 'react-table/react-table.css'


const Table = props => {
    let columns = [];
    let data = [];
    for (let key in props.result[0]) {
        columns.push({
            Header: key,
            accessor: key
        });
    }
    for (let i = 0; i < props.result.length; i++) {
        data.push(props.result[i]);
    }
    let length;
    if (data.length >= 10) {
        length = 10
    } else {
        length = props.result.length;
    }
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

};
Table.propTypes = {
    result: PropTypes.array,
};

export default Table;


