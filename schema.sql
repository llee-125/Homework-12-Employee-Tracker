DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE Employee (
id INT NOT NULL AUTO_INCREMENT,
fname VARCHAR(30) NOT NULL,
lname VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id)
);

CREATE TABLE Department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE Role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL NOT NULL,
dept_id INT NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO Employee (fname, lname, role_id)
VALUES ("Mike", "Lee", 1 ), ("Brytney", "Lee", 2), ("Jude", "Lee", 3), ("John", "Smith",3), ("Jane", "Dough",2), ("Mickey", "Mouse",1), ("Donald", "Duck",1);

INSERT INTO Department (name)
VALUES ("Sales"), ("Marketing"), ("Accounts Payable"), ("IT");

INSERT INTO Role (title, salary, dept_id)
VALUES ("Secretary", 500.00, 3), ("SecretaryII", 700.00, 3), ("Manager", 5000.00, 2);


