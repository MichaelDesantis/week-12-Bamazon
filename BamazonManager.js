var sql = require('mysql');
var prompt = require('prompt');
var table = require('table');
var clear = require('clear');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "Bamazon"
});