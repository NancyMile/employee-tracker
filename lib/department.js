class Department {
    // Save a reference for `this` in `this` as `this` will change inside of inquirer
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    getName(){
        return this.name;
    }

    getId(){
        return this.id;
    }   
}
module.exports = Department;