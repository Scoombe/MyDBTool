# MyDBTool

> MySQL Client with performance monitoring/ Node.js/ Electron/ node-Mysql/ React/ Redux/ ReactTables/ Reach-chartjs/ MySQL


A platform independant MySQL client with UI, slow query monitoring and processlist performance monitoring. The idea of the project was to create a cross-platform MySQL client using electron to be used locally on the MySQL server and provide a way to:
* Query the Database 
* Use explain to automatically catch any system crippling queries
* Monitor running queries
* Monitor the MySQL process's resource usage
* Watch slow query tables and extract and generalise the variables of the worst offenders

To install and start MyDBTool enter the following:
```
npm install
npm run make
npm run electron
```
If you wish to run the development version enter:
```
//run this first
npm start
// then in a seperate terminal
npm run electron-dev
```

## Screenshots
#### Monitoring
> Monitoring the MySQL process and MySQL processlist for a specific instance

![alt tag](screenshots/Monitor.png)
#### Query
> Querying the selected schema and showing the explain results

![alt tag](screenshots/Querying.png)