import mysql from "mysql";


const buildTable = function (results, type) {
    console.log(results[0]);
    let borderColor = '';
    if (type === 'explain') {
        borderColor = 'border-warning';
    } else {
        borderColor = 'border-primary';
    }
    let keys = Object.keys(results[0]);
    let headrow = '';
    let datarow = '';
    for (let c = 0; c < results.length; c++) {
        datarow += '<tr>';
        for (let i = 0; i < keys.length; i++) {

            datarow += '<td class="' + borderColor + '">' + results[c][keys[i]] + '</td>';

        }
        datarow += '</tr>'
    }
    for (let i = 0; i < keys.length; i++) {
        headrow += `<td class="${borderColor}">${keys[i]}</td>`;
    }
    let table = `<table class="table ${borderColor}">
    <thead class="${borderColor}">
    <tr class="${borderColor}">
        ${headrow}
    </tr>
    </thead>
    <tbody class="${borderColor}">
        ${datarow}
    </tbody>
</table>
    `;
    table = '<div class="' + borderColor + '">' + table + '</div>';
    return table;
};

const connect = function (host, port, user, password) {
    const connection = mysql.createConnection({
        host: host || 'PCBW2',
        port: port || 3307,
        user: user || 'root',
        password: password || 'dev'
    });
    console.log(`${host} ${port} ${user} ${password}`);
    connection.connect(function (err) {
        if (err) {
            console.error(err);
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });

    return connection

};

const exQuery = function (id, connection, schema, query) {
    connection.query('use ' + schema, function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        console.log(fields);
        console.log('Using ' + schema);
        connection.query('explain ' + query, function (error, results, fields) {
            if (error) throw error;
            let explain = buildTable(results, 'explain');
            $('#query-explain-' + id + '-' + schema).append(explain);
            console.log(results);
            console.log(fields);
            console.log('results from explain bro');
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                $('#spinner-' + id + '-' + schema).fadeOut('slow');
                let resulttable = buildTable(results, 'query');
                $('#query-results-' + id + '-' + schema).append(resulttable);
                console.log(results);
                console.log(fields);
                console.log('results from query bro');
            })
        })
    })

};
const askDB = function (connection, schema, query) {
    let res = '';
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        res = results;
        console.log(res);
        console.log('these the quryres');
    });
    connection.ping(function (err) {
        if (err) throw err;
        return res;
    })

};

function getSchema(self, connection) {

    let schemas = connection.query('show databases;', function (error, results) {
        let connectedSchemas = '<select id="schema-' + self.id.substr(-1) + '" class="custom-select dropdown" style="padding-left: 10px;">';
        let rtms = '';
        let otherSchemas = '';
        for (let i = 0; i < results.length; i++) {

            if (results[i]["Database"].startsWith('rostrvm')) {
                rtms += `<option class="dropdown-item"> ${results[i]["Database"]}</option>`
            } else {
                otherSchemas += `<option class="dropdown-item">${results[i]["Database"]}</option>`;
            }
        }
        let schemaOptions = `
        <div class="btn-group">
            <button type="button" id="schema-options-${self.id.substr(-1)}" class="btn btn-sm btn-outline-success" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="border-radius: 4px" ><span class="icon icon-chevron-small-down" style="text-align: left;"></span> </button>
            <div class="dropdown-menu schema-actions"> 
                <a id="create-connection-${self.id.substr(-1)}" class="dropdown-item create-connection" href="#">Add new Connection</a>
                <a id="create-query-${self.id.substr(-1)}" class="dropdown-item create-query" href="#">Add new Query</a>
                <a id="create-cookbook-${self.id.substr(-1)}" class="dropdown-item create-cookbook" href="#">Add new Cookbook Search</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Disconnect</a>
            </div>
        </div>
        `;
        connectedSchemas += rtms + '<option class="dropdown-divider" disabled></option>' + otherSchemas + '</select>' + schemaOptions;

        if ($('#schema-' + self.id.substr(-1)).length) {
            //$('#schema-' + self.id.substr(-1)).replaceWith(connectedSchemas);
        } else {
            $('#slot' + self.id.substr(-1)).parent().append(connectedSchemas);
        }
        return self.id.substr(-1)

    });

}

const findQ = function (id, schema, connection, column, recipes) {
    const colExist = document.getElementById('table-' + column + '-' + id + '-' + schema);
    if (colExist !== null) {
        $("#table-" + column).parent().remove();
    }
    let q = `SELECT
	            report    AS Report,
	            title     AS Panel,
	            sql_macros.name as QName,
	            statement AS Q
            FROM sql_macros
	            LEFT JOIN supervisor_report_panels ON (sql_macros.NAME = supervisor_report_panels.NAME)
            where STATEMENT like '%${column}%';`;

    connection.query(q, function (error, results, fields) {
        if (error) throw error;

        /*
        May want to convert this to an automatic table creator with options depending on what table is being created
         */
        let table = `<div class="panel panel-default">
    <button type="button" class="btn btn-s btn-danger clear-query" style="float: right;margin: 10px;"
            onclick="this.parentNode.remove()"><span class="icon icon-cross"></span>
    </button>
    <div class="panel-heading statcard statcard-outline-info p-4 mb-2">
        <a data-toggle="collapse" data-parent="#results" href="#table-${column}" style="color: white;">
            <h6 class="statcard-number panel-title">
                ${column}
                <small class="delta-indicator delta-positive"></small>
            </h6>
            <span class="statcard-desc">Results: ${results.length}</span>
        </a>

    </div>
    <div class="panel-collapse collapse in show" id="table-${column}-${id}-${schema}">
        <table class="table" data-sort="table" id="tb-${column}-${id}-${schema}">
            <thead style="background-color: #373c48">
            <tr>

                <th class="header">Report</th>
                <th class="header">Panel</th>
                <th class="header">Query Name</th>
                <th class="header">Link</th>
            </tr>
            </thead>
            <tbody>`;
        for (let i = 0; i < results.length; i++) {

            let tableData = `
      
      <tr>      
          <td>${results[i]['Report']}</td>
          <td>${results[i]['Panel']}</td>
          <td>${results[i]['QName']}</td>
          <td class="showReport" reportlink="${results[i]['QName']}">Show </td>
          
        </tr>`;
            table = table + tableData
        }
        table = table + '</tbody>\n    </table>';

        $('#cookbook-body-' + id + '-' + schema).append(table + recipes + '</div></div>');
        /*$('tr').on('click', 'td.showReport', function (self) {

            var link = $(this).attr('reportlink');
            console.log(link);
            const {ipcRenderer} = require('electron');
            ipcRenderer.send('async-link', link);
        });
         */
        /*
       Create the Cookbook Results then use .after() against the table-column
        */
    });

};

const findStatement = function (connection, query_name) {
    let q = `select statement as statement from sql_macros where name ='${query_name}'`;

    connection.query(q, function (error, results, fields) {
        if (error) throw error;

        $('body').trigger('gotQ', results[0]['statement']);
        return results[0]['statement'];
    });
};

const disconnect = function (connection) {
    connection.end();
};




module.exports.exask = exQuery;
module.exports.connect = connect;
module.exports.ask = askDB;
module.exports.getSchema = getSchema;
module.exports.disconnect = disconnect;
module.exports.findQ = findQ;
module.exports.findStatement = findStatement;