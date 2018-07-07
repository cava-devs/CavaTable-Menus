-- USE DATABASE
\connect abletable

\copy meal_time(meal_time) From '/root/source/mealTime.csv' CSV
\copy dietary(dietary_type) From '/root/source/dietarycsv' CSV
\copy menu_section(section_name, time_id) From '/root/source/menuSection.csv' DELIMITER ',' CSV
-- \copy restaurant(rest_name) FROM './root/source/restaurant.csv' CSV
-- \copy menu_dietary(menu_id, dietary_id) FROM '/root/source/menuDiatery.csv' DELIMITER ',' CSV


-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From '/root/source/menuSQL1.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From '/root/source/menuSQL2.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From '/root/source/menuSQL3.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From '/root/source/menuSQL4.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL5.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL6.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL7.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL8.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL9.csv' DELIMITER '|' CSV
-- \copy menu(rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) From './root/source/menuSQL10.csv' DELIMITER '|' CSV


