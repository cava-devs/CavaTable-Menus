const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1']});
const helper = require('./seed');


let end = 3000; //10000000
console.time(`generate ${end} datas`);
for (let i = 1; i <= end; i++) {
    let data = helper.generateMenuDataForCassandra(i);
    // let restID= data.rest_id;
    // let restName = data.rest_name;
    // let menuList = JSON.stringify(data.menu_list);

    // let query= `INSERT INTO test.testMenu (rest_id, rest_name, menu_list) VALUES (?, ?, ?) `;
    let query= `INSERT INTO abletable.menus (rest_id, rest_name, menu_list) VALUES (?, ?, ?) `;
    let params = [data.rest_id, data.rest_name, data.menu_list];
    client.execute(query, params,{ prepare: true}, (err) => {
        if (err) {
            console.log(err);
        }
    }); 
}
console.timeEnd(`generate ${end} datas`);








