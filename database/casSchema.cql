-- CREATE KEYSPACE test WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 } AND DURABLE_WRITES = false;

USE test;

CREATE TYPE menutype (
  dish_name text,
  dish_desc text,
  price text,
  photo_url text,
  timetype text,
  sectionType text,
  Vegetarian boolean,
  NonVegetarian boolean,
  Vegan boolean,
  GlutenFree boolean
);

CREATE TABLE testMenu (
  rest_id INT PRIMARY KEY,
  rest_name text,
  menu_list list<frozen <map<text,text>>>,
);