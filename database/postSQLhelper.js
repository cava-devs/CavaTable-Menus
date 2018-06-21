const { Client } = require('pg');
const connectURL = "postgres://fiona@localhost/database";
const client = new Client();

client.connect(connectURL);

const insertion = (tablename, value)  => {
    let queries = `INSERT INTO ${tablename} VALUES ${value}`;
    client.query();
};

