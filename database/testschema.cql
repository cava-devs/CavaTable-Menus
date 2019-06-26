-- CREATE KEYSPACE IF NOT EXISTS abletable WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 } AND DURABLE_WRITES = false;

-- USE abletable;
USE test;

CREATE TYPE IF NOT EXISTS dishes (
  dish_name text,
  dish_desc text,
);

CREATE TABLE IF NOT EXISTS menu (
  rest_id INT PRIMARY KEY,
  rest_name text,
  menu_list list<<menutype>>,
);
