/**
 * Created by Alec on 2/27/2016.
 */

var config = require('./databaseConfig');
module.exports = require('mysql').createConnection(config);