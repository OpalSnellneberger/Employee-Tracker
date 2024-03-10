// Import necessary modules
const { table } = require('table');
const inquirer = require('inquirer');
const startConnection = require('./db/connection');

// Initialize database connection variable
let db = null;

// Configuration for table formatting
const config = {
  columns: {
    0: { alignment: 'left' },
    1: { alignment: 'left' },
  },
  border: {
    topBody: `─`,
    topJoin: `┬`,
    topLeft: `┌`,
    topRight: `┐`,
    bottomBody: `─`,
    bottomJoin: `┴`,
    bottomLeft: `└`,
    bottomRight: `┘`,
    bodyLeft: `│`,
    bodyRight: `│`,
    bodyJoin: `│`,
    joinBody: `─`,
    joinLeft: `├`,
    joinRight: `┤`,
    joinJoin: `┼`
  }
};

// Questions for the start menu
const questions = [
  {
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update Employee Role',
      'Delete department',
      'Delete role',
      'Delete employee',
      'Quit'
    ],
    terminal: true 
  },
];

// Initialize function
async function init() {
  // Start database connection
  db = await startConnection();
  console.log(`Connected to the employeeTracker_db database.`);
  // Start the main menu
  await startMenu();
}

// Main menu function
async function startMenu() {
  const answers = await inquirer.prompt(questions)
  const choice = await answers.option;
  // Route based on user choice
  switch (choice) {
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'View All Roles':
      viewAllRoles();
      break;
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'Add a Department':
      addDepartment();
      break;
    case 'Add a Role':
      addRole();
      break;
    case 'Add an Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      updateEmployeeRole();
      break;
    case 'Delete department':
      deleteDepartment();
      break;
    case 'Delete role':
      deleteRole();
      break;
    case 'Delete employee':
      deleteEmployee();
      break;
    case 'Quit':
      Quit()
      break;
  }
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    const results = await db.query("SELECT * FROM department");
    console.log("Viewing All Departments: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "name"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to view all roles
async function viewAllRoles() {
  try {
    const results = await db.query(`
    SELECT 
        role.id, 
        role.title, 
        role.salary, 
        department.name AS department
      FROM 
        role
      JOIN 
        department ON role.department_id = department.id`);
    console.log("Viewing All Roles: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "title", "salary", "department"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to view all employees
async function viewAllEmployees() {
  try {
    const results = await db.query(`
    SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS job_title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
      FROM 
        employee
      LEFT JOIN 
        role ON employee.role_id = role.id
      LEFT JOIN 
        department ON role.department_id = department.id
      LEFT JOIN 
        employee manager ON employee.manager_id = manager.id`);
    console.log("Viewing All Employees: ");
    const displayTable = results[0].map(row => Object.values(row));
    displayTable.unshift(["id", "first_name", "last_name", "job_title", "department", "salary", "manager_name"]);
    console.log(table(displayTable, config));
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to add a department
async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter the name of the new department.',
      }
    ]);
    await db.query('INSERT INTO department (name) VALUES (?)', answers.newDepartment);
    console.log('Department added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to add a role
async function addRole() {
  try {
    const results = await db.query("SELECT * FROM department");
    const departmentChoices = results[0].map(({ id, name }) => ({
      name: name,
      value: id
    }));
    const newRoleData = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the name of the role?'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?'
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'What department should this role be added to?',
        choices: departmentChoices,
        terminal: true
      }
    ]);
    await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [newRoleData.title, newRoleData.salary, newRoleData.department_id]);
    console.log('Role added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to add an employee
async function addEmployee() {
  try {
    const roleResults = await db.query("SELECT id, title FROM role");
    const roles = roleResults[0].map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    const employeeNames = await db.query("SELECT id, first_name, last_name FROM employee");
    const employees = employeeNames[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    const newEmployee = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name.",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name.",
      },
      {
        type: 'list',
        name: 'role_Id',
        message: "Select the employee's role.",
        choices: roles,
        terminal: true
      },
      {
        type: 'list',
        name: 'manager_Id',
        message: "Select the employee's manager.",
        choices: [
          { name: "None", value: null },
          ...employees
        ],
        terminal: true
      }
    ]);
    await db.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [newEmployee.firstName, newEmployee.lastName, newEmployee.role_Id, newEmployee.manager_Id]
    );
    console.log('Employee added to the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to update employee role
async function updateEmployeeRole() {
  try {
    const employeeResults = await db.query("SELECT id, first_name, last_name FROM employee");
    const employees = employeeResults[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));
    const roleResults = await db.query("SELECT id, title FROM role");
    const roles = roleResults[0].map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    const updatedEmployee = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employees,
        terminal: true
      },
      {
        type: 'list',
        name: 'newRoleId',
        message: 'Select the new role for the employee:',
        choices: roles,
        terminal: true
      },
    ]);
    await db.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [updatedEmployee.newRoleId, updatedEmployee.employeeId]
    );
    console.log('Employee role updated in the database.');
  } catch (error) {
    console.error(error);
  }
  init();
}

// Function to delete a department
async function deleteDepartment() {
  const departments = await db.query("SELECT * FROM department");
  const departmentChoices = departments[0].map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { departmentId } = await inquirer.prompt({
    type: 'list',
    name: 'departmentId',
    message: 'Select the department to delete:',
    choices: departmentChoices,
    terminal: true
  });
  await db.query('DELETE FROM department WHERE id = ?', [departmentId]);
  console.log('Department deleted.');
  init();
}

// Function to delete a role
async function deleteRole() {
  const roles = await db.query("SELECT * FROM role");
  const roleChoices = roles[0].map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await inquirer.prompt({
    type: 'list',
    name: 'roleId',
    message: 'Select the role to delete:',
    choices: roleChoices,
    terminal: true
  });
  await db.query('DELETE FROM role WHERE id = ?', [roleId]);
  console.log('Role deleted.');
  init();
}

// Function to delete an employee
async function deleteEmployee() {
  const employees = await db.query("SELECT * FROM employee");
  const employeeChoices = employees[0].map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { employeeId } = await inquirer.prompt({
    type: 'list',
    name: 'employeeId',
    message: 'Select the employee to delete:',
    choices: employeeChoices,
    terminal: true
  });
  await db.query('DELETE FROM employee WHERE id = ?', [employeeId]);
  console.log('Employee deleted.');
  init();
}

// Function to quit the application
function Quit() {
  console.log("Exiting")
  process.exit()
}

// Start the application
init();
