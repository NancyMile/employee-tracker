class Role {
    // Save a reference for `this` in `this` as `this` will change inside of inquirer
    constructor(id, title, salary, department_id) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    getName(){
        return this.title;
    }

    getId(){
        return this.id;
    }
}
module.exports = Role;