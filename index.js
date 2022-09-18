const inquirer = require('inquirer'); //pakage for console input

//logo
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());
/** taken from https://www.npmjs.com/package/asciiart-logo */

function init(){
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
                // case 'View all employees': viewEmployees();
                //       break;
                 case 'View all employees by department': viewEmployeesDepartment();
                      break;
                // case 'View all employee by manager': viewEmployeeManager();
                //       break;     
                // default:
                //     break;
            }
        })
    }

    //employee intern
    function viewEmployeesDepartment(){
        
    }

init();