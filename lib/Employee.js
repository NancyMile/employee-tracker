class Employee {
    // Save a reference for `this` in `this` as `this` will change inside of inquirer
    constructor(id, first_name, last_name, manager_id, role_id) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager_id = manager_id;
        this.role_id = role_id;
    }

    getName(){
        return this.first_name;
    }

    getId(){
        return this.id;
    }
}
module.exports = Employee;