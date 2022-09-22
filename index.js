const inquirer = require('inquirer'); //pakage for console input
//const db = require("./db");
//require(console.table);
const express = require('express');
const mysql = require('mysql2');
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//logo
const logo = require('asciiart-logo');
const config = require('./package.json');
const Role = require('./lib/Role');
const Choice = require('inquirer/lib/objects/choice');
console.log(logo(config).render());
/** taken from https://www.npmjs.com/package/asciiart-logo */

const configDB = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
);

let department_choices = [];
let manager_choices = [];
let roles_choices = [];
let employees_choices =[];
let role_id;

function init(){
    ///logo ET (Employee Tracker)
    console.log(    
      `        __\\\\\\\\\\\\\\\\\\\\\\\\\___\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_        
         _\/\\\///////////__\///////////////__       
          _\/\\\___________________\/\\\_______      
           _\/\\\\\\\\\\\\\\\\\\___________\/\\\_______     
            _\/\\\///////____________\/\\\_______    
             _\/\\\___________________\/\\\_______   
              _\/\\\___________________\/\\\_______  
               _\/\\\\\\\\\\\\\\\\\\\\\\\\________\/\\\_______ 
                _\////////////_______////________`);

    inquirer.prompt([{
        type: 'list',
        name: 'actions',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all employees by department',
            'View all employees by manager',
            'Add Employee',
            'Remove employee',
            'Update employee',
        ],
    },])
    .then((choice) =>{
        switch(choice.actions){
            case 'View all employees': viewEmployees();
                break;
            case 'View all employees by department': viewEmployeesDepartment();
                break;
            case 'View all employees by manager': viewEmployeesManager();
                break;
            case 'Add Employee': viewAddEmployee();
                break;
            case 'Remove employee': removeEmployee();
                break;
            case 'View all employees by manager': viewEmployeesManager();
                break;
            default:
                break;
        }
    })
}

// employees by department
function viewEmployeesDepartment(){
    //connect to db and select all departments
    let sqlQuery = "Select * from departments";
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        department_choices = data;
        inquirer.prompt([{
            type: 'list',
            name: 'departments',
            message: 'which department would you like to see employees from?',
            //list of departments
            choices: department_choices
        },])
        .then((choice) =>{
            viewEmployeeByDepartment(choice.departments);
        })
    });
}

function viewEmployeeByDepartment(department){
    //select all from engineering dept
    let sqlQuery = `SELECT
    e.first_name,
    e.last_name,
    r.title,
    r.salary,
    d.name as department
    FROM
    employees AS e,
    roles AS r,
    departments AS d
    WHERE
    d.name = "`+ department+`" and
    r.department_id = d.id AND r.department_id = d.id AND e.role_id = r.id`;
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        console.table(data);
    });    
}

//list all employes
function viewEmployees(){
    let sqlQuery = `SELECT
    e.first_name,
    e.last_name,
    r.title,
    r.salary,
    d.name as department
    FROM
    employees AS e,
    roles AS r,
    departments AS d
    WHERE
    r.department_id = d.id AND r.department_id = d.id AND e.role_id = r.id`;
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        console.table(data);
    });
}

//view employees by manager
function viewEmployeesManager(){
    //connect to db and select all employees
    let sqlQuery = `SELECT
    e.first_name as name
    FROM
    employees AS e,
    roles AS r,
    departments AS d
    WHERE
    e.id in (2,4,6,9,13) AND
    r.department_id = d.id AND r.department_id = d.id AND e.role_id = r.id`;

    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        //iterate for all the rows in result
        Object.keys(data).forEach(function(key) {
            var row = data[key];
            manager_choices.push(row.name);
        });
        manager_choices = data;
        inquirer.prompt([{
            type: 'list',
            name: 'managers',
            message: 'which manager would you like to see reports from?',
            //list of managers
            choices: manager_choices
        },])
        .then((choice) =>{
            viewManagerDetails(choice.managers);
        })
    });
}

//manager details
function viewManagerDetails(manager){
    let sqlQuery = `SELECT
    e.first_name,
    e.last_name,
    r.title,
    r.salary,
    d.name as department
    FROM
    employees AS e,
    roles AS r,
    departments AS d
    WHERE
    e.first_name = '`+ manager +`' AND
    r.department_id = d.id AND r.department_id = d.id AND e.role_id = r.id`;
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        console.table(data);
    });
}

function getListRoles(first_name,last_name){
      //get roles
      let sqlQuery = `SELECT
      r.id,
      r.title as name
      FROM
      roles AS r`;
      configDB.query(sqlQuery, function(err,data){
          if(err) console.log(err);
          //console.table(data);
          Object.keys(data).forEach(function(key) {
              var row = data[key];
              roles_choices.push(row.id,row.name);
          });
        roles_choices = data;
        //select the role
        inquirer.prompt([{
            type: 'list',
            name: 'roles',
            message: 'Select your role',
            //list of roles
            choices: roles_choices
        },])
        .then((choice) =>{
            //saveNuewEmployee(first_name, last_name, choice.roles);
            //get id
            let sqlQuery = `SELECT
                r.id
                FROM
                roles AS r  where r.title ='`+choice.roles+`'`;
            configDB.query(sqlQuery, function(err,data){
                if(err) console.log(err);
                Object.keys(data).forEach(function(key) {
                    var row = data[key];
                    role_id = row.id;
                    //insert nre employee
                    let sqlQueryInsert = `INSERT INTO employees (first_name, last_name, role_id) VALUES (?)`;
                    let values = [
                        first_name,
                        last_name,
                        role_id
                    ];
                    configDB.query(sqlQueryInsert, ([values]), function(err,data){
                        if(err) console.log(err);
                        //display all the employee to see the new one
                        viewEmployees();
                    });
                });
            });
        })
   });
}

function viewAddEmployee(){
    // input the data of the new employee
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee name?',
            //check that is not empty
            validate: (answer) =>{
                if(answer !== ''){
                    return true;
                }
                return 'Please enter employee name';
            },
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee last name?',
            //check that is not empty
            validate: (answer) =>{
                if(answer !== ''){
                    return true;
                }
                return 'Please enter employee last name';
            },
        },
    ])
    .then((answers) => {
        //cretaes the object manager
        const role = new Role(
            answers.first_name,
            answers.last_name
        );
        getListRoles(answers.first_name, answers.last_name); //get list of roles
    })
}
// remove employee
function removeEmployee(){
    //select all employees
    let sqlQuery = `SELECT
    e.id as value,
    e.first_name AS name
    FROM
    employees AS e`;
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        //console.table(data);
        Object.keys(data).forEach(function(key) {
            var row = data[key];
            employees_choices.push(row.id,row.name);
        });
        employees_choices = data;
        //select the role
        inquirer.prompt([{
            type: 'list',
            name: 'employees',
            message: 'Select employee to be deleted',
            //list of roles
            choices: employees_choices
        },])
        .then((choice) =>{
            //delete(choice.employees);
            let sqlQuery = `Delete from employees where id =`+choice.employees;
            configDB.query(sqlQuery, function(err){
                if(err) console.log(err);
                //display all the employee to see the new one
                viewEmployees();
            });
         });
    });
}
init();