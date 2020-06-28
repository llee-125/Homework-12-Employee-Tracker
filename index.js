var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
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
          multiSearch();
          break;

        case "Add employee":
          rangeSearch();
          break;

        case "Remove employee":
          songSearch();
          break;

        case "Update employee role":
          songAndAlbumSearch();
          break;

        case "Add role":
          songAndAlbumSearch();
          break;

        case "Remove role":
          songAndAlbumSearch();
          break;

        case "View roles":
          songAndAlbumSearch();
          break;

        case "Add department":
          songAndAlbumSearch();
          break;

        case "View department":
          songAndAlbumSearch();
          break;

        case "Remove department":
          songAndAlbumSearch();
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

function viewAllEmployeesByDepartment() {
  var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].artist);
    }
    searchEmployees();
  });
}

function rangeSearch() {
  inquirer
    .prompt([
      {
        name: "start",
        type: "input",
        message: "Enter starting position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "end",
        type: "input",
        message: "Enter ending position: ",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      var query =
        "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
      connection.query(query, [answer.start, answer.end], function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(
            "Position: " +
              res[i].position +
              " || Song: " +
              res[i].song +
              " || Artist: " +
              res[i].artist +
              " || Year: " +
              res[i].year
          );
        }
        searchEmployees();
      });
    });
}

function songSearch() {
  inquirer
    .prompt({
      name: "song",
      type: "input",
      message: "What song would you like to look for?",
    })
    .then(function (answer) {
      console.log(answer.song);
      connection.query(
        "SELECT * FROM top5000 WHERE ?",
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
