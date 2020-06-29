var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Popover2020!",
  database: "employee_tracker",
});

connection.connect(function (err) {
  if (err) throw err;
  searchEmployees();
});

function searchEmployees() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        //done
        "View all employees",

        //same thing as view all employees except use a where clause, this one you will have to do another inquirer prompt
        "View all employees by department",

        // insert
        "Add employee",

        // delete
        "Remove employee",

        // update with a where clause, same thing as manager except role
        "Update employee role",

        // insert
        "Add role",

        // delete
        "Remove role",

        // seelect
        "View roles",
        "Add department",
        "View department",
        "Remove department",
        "exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;

        case "View all employees by department":
          viewEmployeesByDepartment();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Remove employee":
          removeEmployee();
          break;

        case "Update employee role":
          updateEmployeeRole();
          break;

        case "Add role":
          addRole();
          break;

        case "Remove role":
          removeRole();
          break;

        case "View roles":
          viewRoles();
          break;

        case "Add department":
          addDepartment();
          break;

        case "View department":
          viewDepartment();
          break;

        case "Remove department":
          removeDepartment();
          break;

        default:
          quit();
      }
    });
}

function viewAllEmployees() {
  var query =
    "SELECT employee.id, employee.fname, employee.lname, role.title, department.name AS department, role.salary, CONCAT(manager.fname, ' ', manager.lname) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.dept_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

function viewEmployeesByDepartment() {
  inquirer
    .prompt({
      name: "employeesByDepartment",
      type: "rawlist",
      message: "What department would you like to view?",
      choices: ["Sales", "Marketing", "Accounts Payable", "IT", "exit"],
    })
    .then(function (a) {
      var query =
        "SELECT employee.id, employee.fname, employee.lname, role.title, department.name AS department, role.salary, CONCAT(manager.fname, ' ', manager.lname)";
      connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        searchEmployees();
      });
    });
}

function addEmployee(userText) {
  return new Promise((res, rej) => {
    connection.query(
      "INSERT INTO employee SET ?",
      [{ text: userText }],
      (err) => {
        err ? rej(err) : res({ msg: "success" });
        console.table(res);
      }
    );
  });
}

function removeEmployee() {
  inquirer
    .prompt({
      name: "list",
      type: "input",
      message: "Which employee would you like to remove?",
    })
    .then(function (answer) {
      console.log(answer.song);
      connection.query(
        "SELECT * FROM employee.fname WHERE ?",
        { song: answer.song },
        function (err, res) {
          console.log(
            "Position: " +
              res[0].position +
              " || Song: " +
              res[0].song +
              " || Artist: " +
              res[0].artist +
              " || Year: " +
              res[0].year
          );
          searchEmployees();
        }
      );
    });
}

function songAndAlbumSearch() {
  inquirer
    .prompt({
      name: "artist",
      type: "input",
      message: "What artist would you like to search for?",
    })
    .then(function (answer) {
      var query =
        "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
      query +=
        "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
      query +=
        "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

      connection.query(query, [answer.artist, answer.artist], function (
        err,
        res
      ) {
        console.log(res.length + " matches found!");
        for (var i = 0; i < res.length; i++) {
          console.log(
            i +
              1 +
              ".) " +
              "Year: " +
              res[i].year +
              " Album Position: " +
              res[i].position +
              " || Artist: " +
              res[i].artist +
              " || Song: " +
              res[i].song +
              " || Album: " +
              res[i].album
          );
        }

        searchEmployees();
      });
    });
}

const quit = () => {
  process.exit();
};
