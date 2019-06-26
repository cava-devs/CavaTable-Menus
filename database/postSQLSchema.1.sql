
-- CREARE DATABASE
DROP DATABASE IF EXISTS ABLETABLE;
CREATE DATABASE ABLETABLE;

-- USE DATABASE
\connect abletable

-- CREATE TABLES

-- create mealtime table

CREATE TABLE meal_time (
    time_id SERIAL PRIMARY KEY,
    meal_time varchar(10)
);

-- create dietary table

CREATE TABLE dietary (
    dietary_id SERIAL PRIMARY KEY,
    dietary_type varchar(16)
);

-- create menu_section table

CREATE TABLE menu_section (
    section_id SERIAL PRIMARY KEY,
    section_name varchar(20),
    time_id integer
);

-- create restaurant table

CREATE TABLE restaurant (
    rest_id SERIAL PRIMARY KEY,
    rest_name varchar(40) NOT NULL
);

-- create menu table

CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    rest_id integer,
    dish_name varchar(30),
    dish_desc text,
    price varchar(10),
    photo_url varchar(50),
    time_id integer,
    section_id integer
);

CREATE INDEX index_restid on menu (rest_id);
CREATE INDEX index_timeid on menu (time_id);

-- create menu_dietary join table

CREATE TABLE menu_dietary (
    id SERIAL PRIMARY KEY,
    menu_id integer,
    dietary_id integer
);

CREATE INDEX index_menuid on menu_dietary(menu_id);