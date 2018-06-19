// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
$(function () {
    const db = require('./dbconnect');
    //const db_class = require('./dbconnect_class');
    const Storage = require('node-storage');
    const cook = require('./cookbook');
    const {ipcRenderer} = require('electron');
    //const connection = db.connect();
    const connections = {};
    let activeConnection = '';

    function addConnection(slot, connect_id, connection, name, options) {
        connections[slot] = {
            connect_id: connect_id,
            connection: connection,
            name: name,
            options: options
        };
        $('#slot' + slot).text(name || slot).removeClass('btn-outline-secondary').addClass('btn-outline-success').removeClass('empty-slot').addClass('connected-slot').click();


    }

    /*
<div class="tabs cookbook" style="display: none;">
    <button data-toggle="collapse" data-target="#addToBook" class="btn btn-primary" style="float: bottom;">+</button>
    <div class="flextable" style="margin: 20px;">
        <div class="flextable-item flextable-primary">
            <input type="text" class="form-control cookbook" id="search" placeholder="Search cookbook">
        </div>
        <div class="flextable-item" style="margin: 20px 20px 20px 0;padding-right: 20px">
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-primary" id="searchBook">
                    Search
                </button>
            </div>
        </div>
    </div>
    <div id="results" class="panel-group">
    </div>
</div>
     */

    $('#slots').on('click', '.create-cookbook', function (e) {
        let id = this.id.substr(-1);
        let name = connections[id].name;
        let schema = $('#schema-' + $('.connected-slot.active').attr('id').substr(-1)).val();
        let newCookbook = `<div id="cookbook-${id}-${schema}1" class="panel panel-default query-tab">
    <button type="button" class="btn btn-s btn-danger clear-query" style="float: right;margin: 10px;"
            onclick="this.parentNode.remove()"><span class="icon icon-cross"></span>
    </button>
    <div class="panel-heading statcard statcard-outline-info p-4 mb-2">
        <a data-toggle="collapse" data-parent="#query-${id + '-' + schema}" href="#cookbook-body-${id + '-' + schema}"
           style="color: white;">
            <h6 class="statcard-number panel-title">
                ${schema}
                <small class="delta-indicator delta-positive"></small>
            </h6>
            <span class="statcard-desc">${connections[id].options.host}</span>
        </a>

    </div>
    <div id="cookbook-body-${id + '-' + schema}" aria-expanded="true"
         class="panel-collapse collapse in show">
        <div class="query-input">
            <div class="flextable-item flextable-primary">
                <input type="text" class="form-control cookbook" id="search-${id}-${schema}" placeholder="Search cookbook">
            </div>
            <div class="flextable-item">
                <div class="btn-group">
                    <button type="button" class="btn btn-outline-success" id="searchBook-${id}-${schema}"
                            data-schema="${schema}" data-connection="${id}">
                        Search
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
        $('#instance-' + id).append(newCookbook);
        $('#searchBook-' + id + '-' + schema).click(function () {
            let schema = $(this).data('schema');
            let id = $(this).data('connection');
            connections[id].connection.query('use ' + schema);
            let val = $('#search-' + id + '-' + schema).val();
            let res = db.findQ(id, schema, connections[id].connection, val, cook.db(cook.book(), 'search', val));

        });
        e.preventDefault();
    });
    $('#slots').on('click', '.create-query', function (e) {
        let id = this.id.substr(-1);
        let name = connections[id].name;

        let schema = $('#schema-' + $('.connected-slot.active').attr('id').substr(-1)).val();
        let newQuery = `<div id="query-${id}-${schema}1" class="panel panel-default query-tab">
    <button type="button" class="btn btn-s btn-danger clear-query" style="float: right;margin: 10px;"
            onclick="this.parentNode.remove()"><span class="icon icon-cross"></span>
    </button>
    <div class="panel-heading statcard statcard-outline-primary p-4 mb-2">
        <a data-toggle="collapse" data-parent="#query-${id + '-' + schema}1" href="#query-body-${id + '-' + schema}1"
           style="color: white;">
            <h6 class="statcard-number panel-title">
                ${schema}1
                <small class="delta-indicator delta-positive"></small>
            </h6>
            <span class="statcard-desc">${connections[id].options.host}1</span>
            <span id="spinner-${id}-${schema}" class="icon icon-hour-glass"
                  style="display: none;"></span>
        </a>

    </div>
    <div id="query-body-${id + '-' + schema}1" aria-expanded="true" class="panel-collapse collapse in show">
        <div>
            <div id="query-${schema}-${id}" class="query-input" style="min-height: 50px"
                 contenteditable="true"></div>
        </div>
        <div class="btn-group">
            <button class="btn btn-outline-success qbtn qbtn-run" data-schema="${schema}"
                    data-connection="${id}"> Run
            </button>
            <button class="btn btn-outline-danger qbtn qbtn-kill" data-schema="${schema}"
                    data-connection="${id}"> Kill
            </button>
        </div>
        <div id="query-explain-${id + '-' + schema}1" style="overflow-x:auto;">

        </div>
        <div id="query-results-${id + '-' + schema}1" style="overflow-x:auto;">

        </div>
    </div>
</div>
        `;
        $('#instance-' + id).append(newQuery);
        e.preventDefault();
    });
    $('#slots').on('click', '.create-connection', function (e) {

        let id = this.id.substr(-1);
        let name = connections[id].name;
        let schema = $('#schema-' + $('.connected-slot.active').attr('id').substr(-1)).val();
        console.log(connections[id]);
        let newConnection = `<div id="connection-${id}" class="statcard statcard-outline-secondary">
    <div id="connect-head-${id}" class="panel-heading statcard statcard-success p-4 mb-2 connect-head">
        <a data-toggle="collapse" data-parent="#connection-${id}" href="#instance-${id}"
           style="color: white;">
            <h5 class="statcard-number panel-title">
                ${name}
                <small class="delta-indicator delta-positive"></small>
            </h5>
            <span class="statcard-desc">${connections[id].options.user + '@' + connections[id].options.host + ':' + connections[id].options.port}</span>

        </a>

    </div>
    <div id="instance-${id}" style="margin: 5px;"
         class="tabs query panel-collapse in collapse show instance" aria-expanded="true">
        <div id="query-${id}-${schema}" class="panel panel-default query-tab">
            <button type="button" class="btn btn-s btn-danger clear-query" style="float: right;margin: 10px;"
                    onclick="this.parentNode.remove()"><span class="icon icon-cross"></span>
            </button>
            <div class="panel-heading statcard statcard-outline-primary p-4 mb-2">
                <a data-toggle="collapse" data-parent="#tabs-query-${id + '-' + schema}"
                   href="#query-body-${id + '-' + schema}" style="color: white;">
                    <h6 class="statcard-number panel-title">
                        ${schema}
                        <small class="delta-indicator delta-positive"></small>
                    </h6>
                    <span class="statcard-desc">${connections[id].options.host}</span>
                    <span id="spinner-${id}-${schema}" class="icon icon-hour-glass" style="display: none;"></span>
                </a>

            </div>
            <div id="query-body-${id + '-' + schema}" aria-expanded="true"
                 class="panel-collapse in collapse show ">
               <div >
                    <div  id="query-${schema}-${id}" class="query-input" style="min-height: 50px" contenteditable="true"></div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-success qbtn qbtn-run" data-schema="${schema}"
                            data-connection="${id}"> Run
                    </button>
                    <button class="btn btn-outline-danger qbtn " data-schema="${schema}"
                            data-connection="${id}"> Kill
                    </button>
                </div>
                <div id="query-explain-${id + '-' + schema}" style="overflow-x:auto;">

                </div>
                <div id="query-results-${id + '-' + schema}" style="overflow-x:auto;">

                </div>
            </div>
        </div>
    </div>
</div>
    `;

        $('#connections').append(newConnection);
        $(this).addClass('disabled');
        $('.connect-head').removeClass('statcard-success').addClass('statcard-outline-success');
        $('#connect-head-' + id).addClass('statcard-success');
        $('.instance:not(#instance-' + id + ')').collapse('hide');
        let $2 = $('#connection-' + id);
        $2.parent().prepend($2);
        $('#instance-' + id).collapse('show');
        e.preventDefault();
    });

    $('#slots').on('click', '.connected-slot', function () {
        $('.connected-slot').removeClass('active');

        if ($('#connect-head-' + this.id.substr(-1))) {
            $('.connect-head').removeClass('statcard-success').addClass('statcard-outline-success');
            $('#connect-head-' + this.id.substr(-1)).addClass('statcard-success');
            $('.instance:not(#instance-' + this.id.substr(-1) + ')').collapse('hide');
            let $2 = $('#connection-' + this.id.substr(-1));
            $2.parent().prepend($2);
            $('#instance-' + this.id.substr(-1)).collapse('show');
        }
        this.active = true;
        activeConnection = db.getSchema(this, connections[this.id.substr(-1)].connection);

    });
    $('#slots').on('click', '.empty-slot', function () {
        $('#db-modal').modal('toggle');

        $('#con-slot-' + $(this).text()).click();
    });
    $('#connections').on('click', '.qbtn-run', function (e) {

        let schema = $(this).data('schema');
        let id = $(this).data('connection');
        $('#spinner-' + id + '-' + schema).fadeIn('slow', function () {
            $(this).addClass('fa-spin');
        });
        let $queryArea = $('#query-' + schema + '-' + id);
        db.exask(id, connections[id].connection, schema, $queryArea.text());
    });

    $('#db-connect-submit').click(function () {
        let options = {
            host: $('#db-host').val(),
            port: $('#db-port').val(),
            user: $('#db-user').val(),
            pass: $('#db-pass').val()
        };
        let slot = $('.con-slot.active').text().trim();
        let name = $('#db-id').val();
        const connection = db.connect(options.host, options.port, options.user, options.pass);
        addConnection(slot, connection.threadId, connection, name, options);
        $('#db-modal').modal('toggle');
        // $('#main-menu').slideDown('slow');
    });

    cook.book = function localStore(path) {
        return new Storage(path || './localStore/cookbook')
    };

    cook.db(cook.book(), 'checkDB');

    $('a.nav-link').click(function () {
        let tabs = document.querySelectorAll('.nav-link');
        for (let i = 0; i < tabs.length; i++) {
            $(tabs[i]).removeClass('active');
        }
        let hide = document.querySelectorAll('.tabs');
        for (let f = 0; f < tabs.length; f++) {
            $(hide[f]).slideUp("slow");
        }
        $(this).addClass('active');

        if ($(this).text() === 'Cookbook') {
            $('.cookbook').slideDown("slow");
            //$('#main-menu').slideUp('slow');
        } else if ($(this).text() === 'Query') {
            $('.query').slideToggle("slow");
            // $('#main-menu').slideUp('slow');
        } else if ($(this).text() === 'DB Tools') {

            $('.db').slideToggle("slow");
        } else {
            console.log('No Match');
        }


    });


    $('div.panel.panel-default.query-tab').on('click', 'button.clear-query', function (e) {
        console.log('Clearing Query');
        this.parentNode.remove();
    });
    $('#db-remember').click(function () {
        if (this.checked) {
            let saveas = `
                    <div  id="db-id-in" class="form-group row hide">
                        <label for="db-id" class="col-sm-2 col-form-label input-group-addon">Save As</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="db-id" placeholder="Database ID">
                        </div>
                    </div>
            `;
            let button = '<button id="db-connect-save" type="button" class="btn btn-success" style="margin-left: 4px">Save</button>';
            $('#db-remember-div').after(saveas);
            $('#db-connect-submit').after(button);
            $('#db-id-in').hide().fadeIn();
        } else {
            $('#db-id-in').remove();
            $('#db-connect-save').remove();
        }
    });
    $('#db-connect').click(function () {
        $('#db-modal').modal('toggle');
    });
    $('#exit').click(function () {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('close-req', 'main');
    });
    $('#results').on('click', '.clear-accord', function (self) {
        this.parentNode.remove();
    });
    $(document).on('click', 'td.showReport', function (self) {
        const report = $(this).attr('reportlink');

    });
    $('body').on('gotQ', function (event, q) {

        ipcRenderer.send('openQ', q);
    });
    $('#cookbook-add').on('click', function (ev) {
        ev.preventDefault();
        // template for entire cookbook
        let data = {
            name: $('#title').val(),
            aliases: $('#tags').val().split(','),
            tables: $('#ckTables').val().split(','),
            formula: $('#ckFormula').val(),
            notes: $('#ckNotes').val()
        };
        cook.db(cook.book(), 'add', data);

    });
    $('#db-connect-cancel').click(function () {
        $('.empty-slot.active').removeClass('active');
        $('#db-modal').modal('toggle');

    });

    $('#db-modal').modal('toggle');

});