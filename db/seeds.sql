INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Person', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 160000, 3),
       ('Accountant', 125000, 3),
       ('Team Leader Legal', 250000, 4),
       ('Lawyer', 190000, 4);

INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES ('Mark','Antony',,1),
       ('James','White',,2),
       ('Nancy','Stanton',2,3),
       ('Vimal','Kumar',,4),
       ('Dilan','li',4,5),
       ('Soyeb','kan',,6),
       ('Mary','Brown',6,7),
       ('Matt','Francis',2,3);