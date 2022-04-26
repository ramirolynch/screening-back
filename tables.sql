drop table users, match_reviews, no_match;

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

create table match_reviews (
	id serial primary key,
	list_id varchar(200),
	searched_name varchar(300) not null,
	matched_name varchar(300) not null,
	score numeric not null,
	positive_match boolean not null,
	review_comments text,
	user_id integer references users
	
);

insert into match_reviews (list_id,searched_name,matched_name,score,positive_match, review_comments, user_id) values('test_list_id','Rolando','Rolando Perez',93,false, 'only matched the first name, so its a negative match',1);

create table no_match (
	id serial primary key,
	searched_name text not null,
	screening_ts timestamp not null default now(),
	user_id integer references users
);

insert into no_match (searched_name,user_id) values ('Pedro Gonzalez',1);