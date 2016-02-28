/**
 * To use this web app you need to create a file "databaseConfig.js" in this files directory that holds the
 * information required by the mysql connection
 */

var config = require('./databaseConfig');
module.exports = require('mysql').createConnection(config);