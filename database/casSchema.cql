CREATE KEYSPACE abletable WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 } AND DURABLE_WRITES = false;

USE abletable;
-- USE test;

CREATE TYPE IF NOT EXISTS menutype (
  dish_name text,
  dish_desc text,
  price text,
  photo_url text,
  time_type text,
  section_type text,
  vegetarian boolean,
  nonvegetarian boolean,
  vegan boolean,
  glutenfree boolean
);

CREATE TABLE IF NOT EXISTS menus (
  rest_id INT PRIMARY KEY,
  rest_name text,
  menu_list list<frozen <menutype>>,
);