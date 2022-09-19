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
console.log(logo(config).render());
/** taken from https://www.npmjs.com/package/asciiart-logo */

const configDB = mysql.createConnection(
    {
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

    inquirer.prompt([
            {
                type: 'list',
                name: 'actions',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all employees by department',
                    'View all employee by manager',
                    'Add Employee',
                    'Remove employee',
                    'Update employee',
                    'Update employee manager',
                ],
            },
        ])
        .then((choice) =>{
            switch(choice.actions){
                case 'View all employees': viewEmployees();
                      break;
                 case 'View all employees by department': viewEmployeesDepartment();
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
        inquirer.prompt([
            {
                type: 'list',
                name: 'departments',
                message: 'which department would you like to see employees from?',
                //list of departments
                choices: department_choices
            },
        ])
        .then((choice) =>{
            switch(choice.departments){
                case 'Engineering': viewEngineeringDepartment();
                      break;
                case 'Finance': viewFinanceDepartment();
                      break;
                case 'Legal': viewLegalDepartment();
                       break;
                case 'Sales': viewSalesDepartment();
                       break;
                default:
                       break;
            }
        })
    });
}

function viewEngineeringDepartment(){
    //select all from engineering dept
    let sqlQuery = `SELECT
    e.first_name,
    e.last_name,
    r.title,
    r.salary,
    d.name
    FROM
    employees AS e,
    roles AS r,
    departments AS d
    WHERE
    r.department_id = 2 AND r.department_id = d.id AND e.role_id = r.id`;
    configDB.query(sqlQuery, function(err,data){
        if(err) console.log(err);
        console.table(data);
    });    
}

init();