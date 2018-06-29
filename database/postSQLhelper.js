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


const getRestMenu = (restID, timeID, callback) => {

    const query = {
        // text: 'SELECT m.menu_id, m.rest_id, m.dish_name, m.dish_desc, m.price, m.photo_url, t.meal_time, s.section_name, d.dietary_type from menu m inner join meal_time t on m.time_id = t.time_id inner join menu_section s on m.section_id = s.section_id inner join menu_dietary j on m.menu_id = j.menu_id inner join dietary d on j.dietary_id = d.dietary_id where rest_id = $1',
        text: 'SELECT m.menu_id, m.dish_name, m.dish_desc, m.price, m.photo_url, t.meal_time, s.section_name, d.dietary_type from menu m inner join meal_time t on m.time_id = t.time_id and m.time_id = $2 and m.rest_id = $1 inner join menu_section s on m.section_id = s.section_id left join menu_dietary j on m.menu_id = j.menu_id left join dietary d on j.dietary_id = d.dietary_id;',
        values: [Number(restID), Number(timeID)],
    };

    client.query(query)
        .then(res => {
            // let data = formatMenuData(res.rows);
            // callback(null, data);
            callback(null, JSON.stringify(res.rows));
        })
        .catch(e => {
            callback(e, null);
        });
};

const mappingTimeANDSection = (name, callback) => {
    const query= {
        text: 'SELECT section_id, time_id FROM menu_section where section_name = $1',
        values: [name],
    };
    //INSERT INTO menu_dietary(menu_id, dietary_id)
    // SELECT 3, 3
    // WHERE
    //     NOT EXISTS (
    //         SELECT * FROM menu_dietary WHERE menu_id = 3 and dietary_id = 3
    //     );

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
            text: 'INSERT INTO MENU (rest_id, dish_name, dish_desc, price, photo_url, time_id, section_id) VAlUES ($1, $2, $3, $4, $5, $6, $7) RETURNING menu_id',
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

const updateDish = (menuID, data, callback) => {
    let keys = Object.keys(data);
    let currentCount = 2;
    let updateSection = [];
    let values = [menuID];
    for (let k = 0; k < keys.length; k++) {
        updateSection.push(`${keys[k]} = $${currentCount}`);
        values.push(data[keys[k]]);
        currentCount++;
    }
    
    const query = {
        text: `UPDATE menu SET ${updateSection.join(',')} where menu_id = $1`,
        values: values,
    };
    client.query(query)
        .then(res => {
            callback(null, res.rows);
        })
        .catch(e => {
            callback(e, null);
        });
};

const deleteDish = (menuID, callback) => {
    const query = {
        text: 'DELETE FROM menu where menu_id = $1',
        values: [menuID],
    };
    client.query(query)
        .then(res => {
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
    // return dishData;
};

const getMaxMenuID = () => {
    client.query('SELECT menu_id from menu order by menu_id desc limit 1')
        .then((res) => {
            return res.rows[0].menu_id;
        })
        .catch((err) => {
            throw err;
        });
};

module.exports = {
    getRestMenu,
    insertNewDish,
    mappingTimeANDSection,
    updateDish,
    deleteDish,
    getMaxMenuID
};