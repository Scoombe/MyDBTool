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
        return (
            <div>
                {/*<ReactTable*/}
                    {/*data={props.data}*/}
                    {/*columns={props.columns}*/}
                      {/*columns={[{*/}
                          {/*Header: 'Name',*/}
                          {/*columns: [{*/}
                              {/*Header: 'First Name',*/}
                              {/*accessor: 'firstName'*/}
                          {/*}, {*/}
                              {/*Header: 'Last Name',*/}
                              {/*id: 'lastName',*/}
                              {/*accessor: d => d.lastName*/}
                          {/*}]*/}
                      {/*}, {*/}
                          {/*Header: 'Info',*/}
                          {/*columns: [{*/}
                              {/*Header: 'Profile Progress',*/}
                              {/*accessor: 'progress',*/}
                              {/*Cell: row => (*/}
                                  {/*<div*/}
                                      {/*style={{*/}
                                          {/*width: '100%',*/}
                                          {/*height: '100%',*/}
                                          {/*backgroundColor: '#dadada',*/}
                                          {/*borderRadius: '2px'*/}
                                      {/*}}*/}
                                  {/*>*/}
                                      {/*<div*/}
                                          {/*style={{*/}
                                              {/*width: `${row.value}%`,*/}
                                              {/*height: '100%',*/}
                                              {/*backgroundColor: row.value > 66 ? '#85cc00'*/}
                                                  {/*: row.value > 33 ? '#ffbf00'*/}
                                                      {/*: '#ff2e00',*/}
                                              {/*borderRadius: '2px',*/}
                                              {/*transition: 'all .2s ease-out'*/}
                                          {/*}}*/}
                                      {/*/>*/}
                                  {/*</div>*/}
                              {/*)*/}
                          {/*}, {*/}
                              {/*Header: 'Status',*/}
                              {/*accessor: 'status',*/}
                              {/*Cell: row => (*/}
                                  {/*<span>*/}
                      {/*<span style={{*/}
                          {/*color: row.value === 'relationship' ? '#ff2e00'*/}
                              {/*: row.value === 'complicated' ? '#ffbf00'*/}
                                  {/*: '#57d500',*/}
                          {/*transition: 'all .3s ease'*/}
                      {/*}}>*/}
                        {/*&#x25cf;*/}
                      {/*</span> {*/}
                                      {/*row.value === 'relationship' ? 'In a relationship'*/}
                                          {/*: row.value === 'complicated' ? `It's complicated`*/}
                                          {/*: 'Single'*/}
                                  {/*}*/}
                    {/*</span>*/}
                              {/*)*/}
                          {/*}]*/}
                      {/*}]}*/}
                      {/*defaultPageSize={10}*/}
                    {/*className="-striped -highlight"*/}
                {/*/>*/}
            </div>
        )
    }

};



