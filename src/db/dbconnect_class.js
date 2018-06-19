//Class based mysql object
const electron = window.require('electron');
const mysql = electron.remote.require('mysql');


export default class connection {
    constructor(host, port, user, password) {
        this.connection = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password
        });
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        this.status = 'Disconnected';
        this.connect = this.connect.bind(this);
        this.useSchema = this.useSchema.bind(this);
        this.explain = this.explain.bind(this);
        this.query = this.query.bind(this);
        this.processList = this.processList.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.getSchema = this.getSchema.bind(this);
    };

    get connection() {
        return this._connection;
    }

    set connection(connection) {
        this._connection = connection;
        console.log("setting connection");
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
        console.log('Setting ID');
    }

    get schema() {
        return this._schema;
    }

    set schema(schema) {
        this._schema = schema;
        console.log('Setting Schema');
    }

    get availSchema() {
        return this._availSchema;
    }

    set availSchema(schemas) {
        this._availSchema = schemas;
        console.log('Setting Available Schemas');
    }

    get runningQs() {
        if (!this.schema) {
            console.log('Please choose a schema to query');
            return undefined;
        }
        const _this = this;
        return test.query(`select count(if(command = 'Query',ID,null)) from information_schema.processlist where DB = '${_this.schema}';`);


    }

    connect() {
        if (this.status !== 'Disconnected') {
            console.log('Connections is ' + this.status + ' on ID:' + this.id);
            return this.connection;
        }
        console.log(this.connection);

        const _this = this;
        return new Promise((resolve, reject) => {
            this.connection.connect(function (err) {

                if (err) {
                    return reject(err);
                }
                _this.status = 'Connected';
                _this.id = _this.connection.threadId;
                resolve();
            });
        })


    };

    useSchema(activeSchema) {
        return new Promise((resolve, reject) => {
            this.connection.query(`use ${activeSchema}`, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            })
        });


    }

    explain(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(`explain ${query}`, (err, rows) => {
                if (err)
                    reject(err);
                resolve(rows);
            })
        })
    }

    query(query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows) => {
                if (error)
                    return reject(error);
                resolve(rows);
            })
        });


    };

    getSchema() {
        return new Promise((resolve, reject) => {
            this.connection.query('show databases;', (err, rows) => {
                this.availSchema = [];
                if (err)
                    return reject(err);
                for (let i = 0; i < rows.length; i++) {
                    this.availSchema.push(rows[i]["Database"]);
                }
                resolve(this.availSchema);
            });
        });

    }

    processList(activeSchema) {
        return new Promise((resolve, reject) => {
            this.connection.query(`select * from information_schema.processlist where DB = '${activeSchema}' and command='Query'`, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });

    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                this.status = 'Disconnected';
                resolve();
            });
        });


    };
}
