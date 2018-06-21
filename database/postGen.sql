-- USE DATABASE
\connect abletable


\copy meal_time(meal_time) From './dummydata/mealTime.csv' CSV
\copy dietary(dietary_type) From './dummydata/dietary.csv' CSV
\copy menu_section(section_name, time_id) From './dummydata/menuSection.csv' DELIMITER ',' CSV

-- insert meal_time
-- \copy meal_time FROM './dummydata/mealTime.csv' DELIMITER ',' CSV
-- \copy restaurant FROM './dummydata/restaurant_0.csv' DELIMITER '|' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_0.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_1.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_2.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_3.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_4.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_5.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_6.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_7.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_8.csv' CSV
\copy restaurant(rest_name) FROM './dummydata/restaurant_9.csv' CSV
