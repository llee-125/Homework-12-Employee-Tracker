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

//-- function to search ALL employees
function searchEmployees() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View all employees",

        "View all employees by department",

        "Add employee",

        "Remove employee",

        "Update employee role",

        "Add role",

        "Remove role",

        "View roles",
        "Add department",
        "View departments",
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

        case "View departments":
          viewDepartments();
          break;

        case "Remove department":
          removeDepartment();
          break;

        default:
          quit();
      }
    });
}

//-- function to view all employees
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

//-- function to view employees by dept
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
          searchEmployees();
        });
      });
  });
}

//-- function to add employees
function addEmployee() {
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
        } else if (answer.role === "Vice President") {
          role_id = 9;
        } else if (answer.role === "Partner") {
          role_id = 10;
        } else if (answer.role === "Associate") {
          role_id = 11;
        } else if (answer.role === "Paralegal") {
          role_id = 12;
        } else if (answer.role === "Secretary") {
          role_id = 13;
        } else if (answer.role === "Cruise Ship Director") {
          role_id = 14;
        } else if (answer.role === "Actor") {
          role_id = 15;
        } else if (answer.role === "Singer") {
          role_id = 16;
        } else if (answer.role === "Friends") {
          role_id = 17;
        } else if (answer.role === "Coach") {
          role_id = 18;
        } else if (answer.role === "Family") {
          role_id = 19;
        }
        var query =
          "INSERT INTO Employee (fname, lname, role_id) VALUES (?, ?, ?)";
        connection.query(
          query,
          [answer.firstName, answer.lastName, role_id],
          function (err, res) {
            console.log("Successfully added the employee!");
            searchEmployees();
          }
        );
      });
  });
}

//-- function to remove employee
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
            searchEmployees();
          }
        );
      });
  });
}

//function to update employee role
function updateEmployeeRole() {
  const query_employee =
    "SELECT id, CONCAT(fname, ' ', lname) AS name FROM Employee";
  const query_role = "SELECT * FROM role";

  connection.query(query_employee, function (err, res) {
    const employees = res.map((element) => element.name);

    connection.query(query_role, function (err, result) {
      const roles = result.map((element) => element.title);

      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            message: "Which employee role would you like to update?",
            choices: employees,
          },
          {
            name: "role",
            type: "rawlist",
            message: "Which role?",
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
          } else if (answer.role === "Vice President") {
            role_id = 9;
          } else if (answer.role === "Partner") {
            role_id = 10;
          } else if (answer.role === "Associate") {
            role_id = 11;
          } else if (answer.role === "Paralegal") {
            role_id = 12;
          } else if (answer.role === "Secretary") {
            role_id = 13;
          } else if (answer.role === "Cruise Ship Director") {
            role_id = 14;
          } else if (answer.role === "Actor") {
            role_id = 15;
          } else if (answer.role === "Singer") {
            role_id = 16;
          } else if (answer.role === "Friends") {
            role_id = 17;
          } else if (answer.role === "Coach") {
            role_id = 18;
          } else if (answer.role === "Family") {
            role_id = 19;
          }
          connection.query(
            `UPDATE employee SET role_id = ? WHERE CONCAT(fname, ' ', lname) = ?`,
            [answer.employee, role_id],
            function (err, res) {
              console.log(res);
              console.log("Updated employee role successfully!");
              searchEmployees();
            }
          );
        });
    });
  });
}

//-- function to Add role
function addRole() {
  const query_dept = `SELECT id, name FROM department`;

  connection.query(query_dept, function (err, res) {
    const departments = res.map((element) => ({
      id: element.id,
      name: element.name,
    }));
    console.log(res);

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Enter the new Role you wish to add.",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the new Role.",
        },
        {
          name: "department",
          type: "list",
          message: "Choose the department for the new Role.",
          choices: departments,
        },
      ])
      .then(function (answer) {
        let dept_id;
        if (answer.department === "Sales") {
          dept_id = 1;
        } else if (answer.department === "Engineering") {
          dept_id = 2;
        } else if (answer.department === "Finance") {
          dept_id = 3;
        } else if (answer.department === "Legal") {
          dept_id = 4;
        } else if (answer.department === "Social") {
          dept_id = 5;
        } else if (answer.department === "Friendly") {
          dept_id = 6;
        } else if (answer.department === "HR") {
          dept_id = 7;
        }
        var query = `INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)`;
        connection.query(
          query,
          [answer.role, answer.salary, dept_id],
          function (err, res) {
            console.log("Successfully added new role!");
            searchEmployees();
          }
        );
      });
  });
}

//-- function to Remove role
function removeRole() {
  const query_role = `SELECT title FROM role`;

  connection.query(query_role, function (err, res) {
    const roles = res.map((element) => element.title);
    inquirer
      .prompt({
        name: "role",
        type: "list",
        message: "Which role would you like to remove?",
        choices: roles,
      })
      .then(function (answer) {
        connection.query(
          `DELETE FROM role WHERE title = ?`,
          [answer.role],
          function (err, res) {
            console.log("Deleted role successfully!");
            searchEmployees();
          }
        );
      });
  });
}

//-- function to View role
function viewRoles() {
  var query = `SELECT * FROM Role`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

//-- function to Add Department
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Which department would you like to add?",
    })
    .then(function (answer) {
      console.log(answer);
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.department],
        function (err, res) {
          console.log("Added department successfully!");
          searchEmployees();
        }
      );
    });
}

//-- function to View department
function viewDepartments() {
  var query = `SELECT * FROM Department`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    searchEmployees();
  });
}

//-- function to Remove Department
function removeDepartment() {
  const query_department = "SELECT * FROM department";

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
            searchEmployees();
          }
        );
      });
  });
}

const quit = () => {
  process.exit();
};
