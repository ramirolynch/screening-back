drop table users;

create table users (
	id serial primary key,
	first_name varchar(100) not null,
	last_name varchar(100) not null,
	email varchar(100) not null,
	password varchar(200) not null
);

insert into users (first_name, last_name, email, password) values ('Ramiro', 'Lynch', 'ramiro@gmail.com', 'ramiropass');
insert into users (first_name, last_name, email, password) values ('Matt', 'Fanto', 'mfanto@gmail.com', 'mattpass');
insert into users (first_name, last_name, email, password) values ('Henry', 'Overholt', 'henry@gmail.com', 'henrypass');
insert into users (first_name, last_name, email, password) values ('Dana', 'Killeen', 'dana@gmail.com', 'danapass');
insert into users (first_name, last_name, email, password) values ('Sudha', 'Vallabhapurapu', 'sudha@gmail.com', 'sudhapass');