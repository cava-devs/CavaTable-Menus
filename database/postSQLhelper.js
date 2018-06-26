const { Client } = require('pg');
// const connectURL = "postgres://fiona@localhost/database";
// const client = new Client();

const client = new Client({
    user: 'fiona',
    host: 'localhost',
    database: 'abletable',
    port: 5432,
  });
  client.connect();
// client.connect(connectURL);


const getRestMenu = (restID, callback) => {

    const query = {
        text: 'SELECT m.menu_id, m.rest_id, m.dish_name, m.dish_desc, m.price, m.photo_url, t.meal_time, s.section_name, d.dietary_type from menu m inner join meal_time t on m.time_id = t.time_id inner join menu_section s on m.section_id = s.section_id inner join menu_dietary j on m.menu_id = j.menu_id inner join dietary d on j.dietary_id = d.dietary_id where rest_id = $1 ',
        values: [restID],
    };

    client.query(query)
        .then(res => {
            let data = formatMenuData(res.rows);
            callback(null, data);
        })
        .catch(e => {
            callback(e, null);
        });
};

const mappingTimeANDSection = (name, callback) => {
    console.log(name);
    const query= {
        text: 'SELECT section_id, time_id FROM menu_section where section_name = $1',
        values: [name],
    };

    client.query(query)
        .then(res => {
           callback(null, res.rows[0]);
           //{ section_id: 2, time_id: 1 }
        })
        .catch(e => {
            callback(e, null);
        });
};

const insertNewDish = ({
    restid, 
    dishname, 
    dishdesc, 
    price, 
    photourl,
    timeid,
    sectionid 
}, callback) => {
        const query = {
            text: 'INSERT INTO MENU (rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) VAlUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [restid, dishname, dishdesc, price, photourl, timeid, sectionid],
        };

        client.query(query)
        .then(res => {
            console.log(res.rows);
            callback(null, res.rows);
        })
        .catch(e => {
            callback(e, null);
        });
};


//pure helper for helper functions
const formatMenuData = (arrayOfData) => {
    let dishData = {};
    for (let i = 0; i < arrayOfData.length; i++) {
        let dish= arrayOfData[i];
        if (dishData[dish.menu_id]) {
            dishData[dish.menu_id].dietary_type[dish.dietary_type] = true;
        } else {
            dishData[dish.menu_id] = {
                dish_name: dish.dish_name,
                dish_desc: dish.dish_desc,
                price: dish.price,
                photo_url: dish.photo_url,
                meal_time: dish.meal_time,
                section_name: dish.section_name,
                dietary_type: {}
            };
            dishData[dish.menu_id].dietary_type[dish.dietary_type] = true;
        }
    }
    let keys = Object.keys(dishData);
    let output = [];
    for (let k = 0; k < keys.length; k++) {
        let value = dishData[keys[k]];
        value['menu_id'] = keys[k];
        output.push(value);
    }
    return output;
};

module.exports = {
    getRestMenu,
    insertNewDish,
    mappingTimeANDSection
};