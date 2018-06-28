
-- CREARE DATABASE
DROP DATABASE IF EXISTS ABLETABLE;
CREATE DATABASE ABLETABLE;

-- USE DATABASE
\connect abletable

-- CREATE TABLES

-- create mealtime table
DROP TABLE IF EXISTS meal_time CASCADE;
CREATE TABLE meal_time (
    time_id SERIAL PRIMARY KEY,
    meal_time varchar(10)
);

-- create dietary table
DROP TABLE IF EXISTS dietary CASCADE;
CREATE TABLE dietary (
    dietary_id SERIAL PRIMARY KEY,
    dietary_type varchar(16)
);

-- create menu_section table
DROP TABLE IF EXISTS menu_section CASCADE;
CREATE TABLE menu_section (
    section_id SERIAL PRIMARY KEY,
    section_name varchar(20),
    time_id integer REFERENCES meal_time(time_id)
);

-- create restaurant table
DROP TABLE IF EXISTS restaurant CASCADE;
CREATE TABLE restaurant (
    rest_id SERIAL PRIMARY KEY,
    rest_name varchar(40) NOT NULL
);

-- create menu table
DROP TABLE IF EXISTS menu CASCADE;
CREATE TABLE menu (
    menu_id SERIAL PRIMARY KEY,
    rest_id integer REFERENCES restaurant(rest_id),
    dish_name varchar(30),
    dish_desc text,
    price varchar(10),
    photo_url varchar(50),
    time_id integer REFERENCES meal_time(time_id),
    section_id integer REFERENCES menu_section(section_id)
);

-- create menu_dietary join table
DROP TABLE IF EXISTS menu_dietary CASCADE;
CREATE TABLE menu_dietary (
    id SERIAL PRIMARY KEY,
    menu_id integer REFERENCES menu(menu_id),
    dietary_id integer REFERENCES dietary(dietary_id)
);
