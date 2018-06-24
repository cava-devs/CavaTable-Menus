const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1']});
const helper = require('./seed');
const Promise = require('bluebird');


// let end = 3000; //10000000
// let connCount = 0;
// console.time(`generate ${end} datas`);

// const insertOnce = (i) => {
//     let data = helper.generateMenuDataForCassandra(i);
//     // let query= `INSERT INTO test.testMenu (rest_id, rest_name, menu_list) VALUES (?, ?, ?) `;
//     let query= `INSERT INTO abletable.menus (rest_id, rest_name, menu_list) VALUES (?, ?, ?) `;
//     let params = [data.rest_id, data.rest_name, data.menu_list];
//     client.execute(
//         query, 
//         params,
//         { prepare: true }, 
//         (err) => {
//         if (err) {
//             console.log(err);
//         }
//     });

// };
// const insertBatch = (startID, amount) => {
//     for (let i = startID; i < startID + amount; i++) {
//         insertOnce(i);
//     }
//     return true;
// };


// const insertAll = (endNumber) => {
//     let gap = 1000;
//     for (let i = 1; i <= endNumber; i+= gap) {
//         insertBatch(i, gap);
//     }
// };

let numOfRounds = 500000;
let totalRes = 10000000; // 10000000
let resEachRound = totalRes / numOfRounds; //10 restaurant each round
let countOfBatch = 20;
let resEachBatch = resEachRound / countOfBatch; //1 restaurant in each batch

let generateParams = (restID) => {
    let data = helper.generateMenuDataForCassandra(restID);
    return [data.rest_id, data.rest_name, data.menu_list];
};

const query= `INSERT INTO abletable.menus (rest_id, rest_name, menu_list) VALUES (?, ?, ?) `;
// const query= `INSERT INTO abletable.res (rest_id, rest_name) VALUES (?, ?) `;

let queries = (restID) => {
    let output = [];
    for (let i = restID; i < restID + resEachBatch; i++) {
        output.push({
            query: query, 
            params: generateParams(i)
        });
    }
    return output;
};

let generatebatches = (round) => {
    let restID = (round) * resEachRound + 1;
    let endrestID = restID + resEachRound; 
    let batches = [];
    for (let i = restID; i < endrestID; i++) { 
        batches.push(client.batch(queries(i), { prepare: true })); 
    }
    return batches;
};


const writeData = (currentRound) => {
    Promise.all(generatebatches(currentRound))
    .then(() => {
        currentRound++;
        currentRound < numOfRounds ? writeData(currentRound) : client.shutdown();
    })
    .catch((err) => {
        console.log(err);
    });
};

writeData(0);








