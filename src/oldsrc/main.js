const {app, BrowserWindow, ipcMain} = require('electron');
if (require('electron-squirrel-startup')) {
    app.quit();
}
const path = require('path');
const url = require('url');

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let store;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1200, height: 1000, frame: false/*,fullscreen: true*/});

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

let childWindow;
let q;
ipcMain.on('openQ', (event, arg) => {
    console.log('IPCMain: received ');
    console.log(event);
    q = arg;
    childWindow = new BrowserWindow({parent: mainWindow, frame: false});
    childWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'query.html'),
        protocol: 'file:',
        slashes: true
    }));


    childWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        childWindow = null
    })
});

ipcMain.on('child-ready', function (event, arg) {
    event.sender.send('childq', q);
});

ipcMain.on('close-req', (event, arg) => {
    if (arg === 'main') {

        mainWindow.close();
    } else if (arg === 'child') {
        childWindow.close();

    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function (command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) {
        }

        return spawnedProcess;
    };

    const spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
}

/*
todo (interesting and important): could really do with learning about promises as im getting fucked by various async callbacks

Todo: Add authentication
    - probably using mysql user_name and password, then work out whether its only got select permissions and if so only display read only operations

todo: db connections
    - need a way to connect to and select a database, probably from a modal and base the available actions off of that connection

    todo (really super optional): create a better auditlog with waveform and maybe basic scorecard

fixmeBen: fix saving the data to the localstore as it currently replaces the existing row

todo: Need to work out a better way of displaying the cookbook results (would it be better in a separate window so we can do more graphical representation of recipe)

todo: change the icons and the setup gif

todo: Work out what db tools we need
        - look up how to run command line apps from nodejs as well need to be able to backup and restore
        - look at current macros and see if theres anything that would be useful here
        -
        - end long calls
        - show and kill long queries
            select * from information_schema.processlist where
        - todo: grab statistics on query run times and somehow report this back to Rostrvm (this way we will be able to estimate database work much more accurately)
                - this may require a Master rtm_cookbook to collate and report on hardware vs dbsize vs query time vs backup time
        - check database size also handy

-todo: see if we can integrate python/percona toolset for slow-query logs and maybe provide interactive graphical interface with reports
        - this should use the same graphs and reporting framework as the rest of the

todo: need to map out the flow of the migration and work out if we can handle more scenarios automatically.
        - add migration queries to separate localstore db (so that we can autoupdate in the future)
        - add the check queries
                - add queries to check which results arent appearing in either system - where difference in checkrows find which ones exist in one and not the other
                - maybe return those results in a separate window and allow and allow additional queries to correct data
                - allow a refresh of the data if you change it externally
        - (optionally) allow the configuration to be merged into the migrated mis instead of the other way around
                -then we can just backup the merged migrated and live mis and configuration and then restore to site
                - will need to create a temporary migration database to insert migrated data into and then work out how to de-dup and align the configuration and references;

todo: finish the query viewer
        - work out the rest of the regular expressions (i want to remove a lot of the pointless line returns)
        - continue with highlighting
        - see what tooltips or help information would be useful
        - comment on joins and whether they are using the indexed columns
        - maybe combine this with the query profiler and add the stats to the performance db
        - possibly highlight and scroll to the column they searched the cookbook for

todo (optional): would it be possible to write a tool to check and correct mirroring

todo (props not): query builder

todo: explain or performance tools

todo (optional): cross network mirror connection

todo (interesting): autoupdate

todo: (interesting): integrate jchartfxplus
        maybe just used as performance indicators

 */