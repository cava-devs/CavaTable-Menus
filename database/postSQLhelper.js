const { Client, Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'fiona',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'abletable',
    port: process.env.POSTGRES_PORT || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  pool.connect();


const getRestMenu = (restID, timeID, callback) => {

    const query = {
        // text: 'SELECT m.menu_id, m.rest_id, m.dish_name, m.dish_desc, m.price, m.photo_url, t.meal_time, s.section_name, d.dietary_type from menu m inner join meal_time t on m.time_id = t.time_id inner join menu_section s on m.section_id = s.section_id inner join menu_dietary j on m.menu_id = j.menu_id inner join dietary d on j.dietary_id = d.dietary_id where rest_id = $1',
        text: 'SELECT m.menu_id, m.dish_name, m.dish_desc, m.price, m.photo_url, t.meal_time, s.section_name, d.dietary_type from menu m inner join meal_time t on m.time_id = t.time_id and m.time_id = $2 and m.rest_id = $1 inner join menu_section s on m.section_id = s.section_id left join menu_dietary j on m.menu_id = j.menu_id left join dietary d on j.dietary_id = d.dietary_id;',
        values: [Number(restID), Number(timeID)],
    };

    pool.query(query)
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

    pool.query(query)
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

        pool.query(query)
        .then(res => {
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
    pool.query(query)
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
    pool.query(query)
        .then(res => {
            callback(null, res.rows);
        })
        .catch(e => {
            callback(e, null);
        });
};

const getMaxMenuID = (callback) => {
    pool.query('SELECT menu_id from menu order by menu_id desc limit 1')
        .then((res) => {
            callback(null, res.rows[0].menu_id);
        })
        .catch((err) => {
            callback(err, null);
        });
};

const getMenuByID = (id, callback) => {
    pool.query(`SELECT * from menu where menu_id = ${id}`)
        .then((res) => {
            callback(null, res.rows[0]);
        })
        .catch((err) => {
            callback(err, null);
        });
};

module.exports = {
    getRestMenu,
    insertNewDish,
    mappingTimeANDSection,
    updateDish,
    deleteDish,
    getMaxMenuID,
    getMenuByID
};