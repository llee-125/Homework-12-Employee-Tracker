var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Popover2020!",
  database: "employee_tracker",
});

connection.connect = () => {
  return new Promise((resolve, reject) => {
    err ? reject(err) : resolve({ msg: "success" });
    searchEmployees();
  });
};

module.exports = connection;
