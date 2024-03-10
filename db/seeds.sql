INSERT INTO department (id, name)
VALUES 
(1, 'English/Language Arts'),
(2, 'Mathematics'),
(3, 'School Operations'),
(4, 'Administration'),
(5, 'Career and Technical Education'),
(6, 'Unified Arts'),
(7, 'Social Studies'),
(8, 'Science'),
(9, 'Foreign Languages'),
(10, 'Guidance');

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1, 'General Education Teacher', 70000, 1),
(2, 'Principal', 100000, 4),
(3, 'Assistant Principal', 90000, 4),
(4, 'Custodian', 60000, 3),
(5, 'Secretary', 60000, 3),
(6, 'Cafeteria Worker', 60000, 3),
(7, 'Counselor', 70000, 10),
(8, 'Special Education Teacher', 70000, 2),
(9, 'ELL Teacher', 70000, 9),
(10, 'Bus Driver', 60000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Harry', 'Potter', 1, 2),
(2, 'Albus', 'Dumbledore', 2, 2),
(3, 'Minerva', 'McGonagall', 3, 2),
(4, 'Argus', 'Filch', 4, 3),
(5, 'Moaning', 'Myrtle', 5, 3),
(6, 'Draco', 'Malfoy', 6, 3),
(7, 'Hermione', 'Granger', 7, 2),
(8, 'Sybill', 'Trelawney', 8, 2),
(9, 'Lord', 'Voldemort', 9, 2),
(10, 'Rubeus', 'Hagrid', 10, 3);