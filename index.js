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

// DONE -- function to search ALL employees
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

        // select
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

// DONE -- function to view all employees
function viewAllEmployees() {
  var query = `SELECT employee.id, employee.fname, employee.lname, role.title, department.name AS department, role.salary, 
    CONCAT(manager.fname, ' ', manager.lname) AS manager 
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department on role.dept_id = department.id 
    LEFT JOIN employee manager on manager.id = employee.manager_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

// DONE -- function to view employees by dept
function viewEmployeesByDepartment() {
  const query_dept = "SELECT * FROM Department";

  connection.query(query_dept, function (err, res) {
    const departments = res.map((element) => element.name);

    inquirer
      .prompt({
        name: "department",
        type: "rawlist",
        message: "What department would you like to view?",
        choices: departments,
      })
      .then(function (answer) {
        var query = `SELECT employee.id, employee.fname, employee.lname, role.title, department.name AS department, role.salary, 
        CONCAT(manager.fname, ' ', manager.lname) AS manager 
        FROM employee 
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.dept_id = department.id 
        LEFT JOIN employee manager on manager.id = employee.manager_id WHERE department.name = ?`;

        connection.query(query, [answer.department], function (err, res) {
          console.table(res);
        });
      });
  });
}

// DONE -- function to add employees
function addEmployee(userText) {
  const query_role = "SELECT * FROM Role";

  connection.query(query_role, function (err, res) {
    const roles = res.map((element) => element.title);

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message:
            "Enter the employee's first name that you would like to add.",
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the employee's last name that you would like to add.",
        },
        {
          name: "role",
          type: "rawlist",
          message: "Select the new employee's role that you would like to add.",
          choices: roles,
        },
      ])
      .then(function (answer) {
        let role_id;
        if (answer.role === "Sales Lead") {
          role_id = 1;
        } else if (answer.role === "Salesperson") {
          role_id = 2;
        } else if (answer.role === "Lead Engineer") {
          role_id = 3;
        } else if (answer.role === "Software Engineer") {
          role_id = 4;
        } else if (answer.role === "Account Manager") {
          role_id = 5;
        } else if (answer.role === "Accountant") {
          role_id = 6;
        } else if (answer.role === "Legal Team Lead") {
          role_id = 7;
        } else if (answer.role === "Lawyer") {
          role_id = 8;
        }
        var query =
          "INSERT INTO Employee (fname, lname, role_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [answer.firstName, answer.lastName, role_id],
          function (err, res) {
            console.log("Successfully added the employee!");
          }
        );
      });
  });
}

// DONE -- function to remove employee
function removeEmployee() {
  const query_employee =
    "SELECT id, CONCAT(fname, ' ', lname) AS name FROM Employee";

  connection.query(query_employee, function (err, res) {
    const employees = res.map((element) => element.name);

    inquirer
      .prompt({
        name: "employee",
        type: "rawlist",
        message: "Which employee would you like to remove?",
        choices: employees,
      })
      .then(function (answer) {
        console.log(answer);
        connection.query(
          "DELETE FROM Employee WHERE CONCAT(fname, ' ', lname) = ?",
          [answer.employee],
          function (err, res) {
            console.log("Deleted employee successfully!");
          }
        );
      });
  });
}

// function to update employee role
// function updateEmployeeRole() {
//   const query_employee =
//     "SELECT id, CONCAT(fname, ' ', lname) AS name FROM Employee";

//   connection.query(query_employee, function (err, res) {
//     const employees = res.map((element) => element.name);

//     inquirer
//       .prompt({
//         name: "employee",
//         type: "rawlist",
//         message: "Which employee role would you like to update?",
//         choices: employees,
//       })
//       .then(function (answer) {
//         connection.query(
//           "UPDATE FROM Employee WHERE CONCAT(fname, ' ', lname) = ?",
//           [answer.employee],
//           function (err, res) {
//             console.log("Updated employee role successfully!");
//           }
//         );
//       });
//   });
// }

// function to Add role
function addRole(userText) {
  const query_role = `SELECT title* FROM Role`;

  connection.query(query_role, function (err, res) {
    const role = res.map((element) => element.title);

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Enter the new Role you wish to add.",
        },
      ])
      .then(function (answer) {
        var query = `ADD INTO Role (title) VALUES (?)`;
        connection.query(query, [answer.role_title], function (err, res) {
          console.log("Successfully added new role!");
        });
      });
  });
}

// function to Remove role
function removeRole() {
  const query_role = `SELECT * FROM Role`;

  connection.query(query_role, function (err, res) {
    inquirer
      .prompt({
        name: "role",
        type: "rawlist",
        message: "Which role would you like to remove?",
        choices: role_title,
      })
      .then(function (answer) {
        connection.query(
          `DELETE FROM Role WHERE title = ?`,
          [answer.role],
          function (err, res) {
            console.log("Deleted role successfully!");
          }
        );
      });
  });
}

// DONE -- function to View role
function viewRoles() {
  var query = `SELECT * FROM Role`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

// // function to Add Department
// connection.query(query_employee, function (err, res) {
//   const employees = res.map((element) => element.name);

//   inquirer
//     .prompt({
//       name: "employee",
//       type: "rawlist",
//       message: "Which employee role would you like to update?",
//       choices: employees,
//     })
//     .then(function (answer) {
//       console.log(answer);
//       connection.query(
//         "UPDATE FROM Employee WHERE CONCAT(fname, ' ', lname) = ?",
//         [answer.employee],
//         function (err, res) {
//           console.log("Updated employee role successfully!");
//         }
//       );
//     });
// });
// }

// // DONE -- function to View department
function viewDepartment() {
  var query = `SELECT * FROM Department`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

// function to Remove Department
function removeDepartment() {
  const query_departments = "SELECT * FROM ";

  connection.query(query_department, function (err, res) {
    const departments = res.map((element) => element.name);

    inquirer
      .prompt({
        name: "departments",
        type: "rawlist",
        message: "Which department would you like to remove?",
        choices: departments,
      })
      .then(function (answer) {
        console.log(answer);
        connection.query(
          "DELETE FROM Department WHERE name = ?",
          [answer.departments],
          function (err, res) {
            console.log("Deleted department successfully!");
          }
        );
      });
  });
}

const quit = () => {
  process.exit();
};
