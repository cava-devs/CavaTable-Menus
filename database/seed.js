// const mongoose = require('mongoose');
// const restaurants = require('./data');
// db.MenuModel.insertMany(restaurants);

//Faker, Lorem Ipsum (text) and Lorem Flickr (images) is recommended
const fs = require('fs');
// const db = require('./index'); //require postgreSQL or Cassendra
const faker = require('faker');
const path = require('path');
const csv = require("fast-csv");

//Assumptions --------------------------->
const startID = 1;
const endID = 10000000; //10000000
const sqlGenerator = true; //set to false if generate for cassandra

let generateRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};


//helper function  --------------------------------------->
let writeFile = (filename, data) => {
    csv.writeToPath(
        path.resolve('./dummydata', filename), 
        data,
        {headers: false})
        .on("finish", () => {
            console.log(`The file ${filename} has been created!`);
         });
};

let appendFile = (filepath, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(
            path.resolve('./dummydata', filepath),
            data,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
};

// let appendFile = (filename, data) => {
//     fs.appendFile(
//         path.resolve('./dummydata', filename), 
//         data,
//         (err) => {
//             if (err) {
//                 throw err;
//             }
//         }
//     );
// };


let generateData = (arrayOfChoice) => {
    let output = [];
    for (let i = 0; i < arrayOfChoice.length; i++) {
        output.push([arrayOfChoice[i]]);
    }
    return output;
};


//generate meal_time table -------------------------------->
let mealTimeChoice = ['Breakfast', 'Lunch', 'Dinner'];
const generateMealtime = () => {
    return generateData(mealTimeChoice);
};

//sqlGenerator ? writeFile('./mealTime.csv', generateMealtime()) : ''; //invoke func

//generate dietary table ---------------------------------->
let dietary = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free'];
const generateDietary = () => {
    return generateData(dietary);
};

//sqlGenerator ? writeFile('./dietary.csv', generateDietary()) : ''; //invoke func

//generate restaurants ------------------------------------>
const generateRestaurant = () => {
    let noOfData = 1000000;
    let start = startID;
    console.time('10M data Write to File');
    for (let i = 0; i < 10; i++) {
        console.time('1M data generate');
        let chunkOfData = "";
        for (let j = start; j < start + noOfData; j++ ) {
            chunkOfData += `${faker.lorem.words(2)}\n`;
        }
        console.timeEnd('1M data generate');
        start = start + noOfData;
        try {
            console.time('Write 1M data to file');
            fs.writeFileSync(
                `./dummydata/restaurant_${i}.csv`,
                chunkOfData
            );
            console.timeEnd('Write 1M data to file');
        } catch (err) {
            throw err;
            
        }
    }
    console.timeEnd('10M data Write to File');
};

const generateRestaurant2 = (noOfChunk) => {
    // let startRestID = startID;
    // let accumulator = Math.floor( ( endID - startID ) / noOfChunk );
    // let chunkOfData;
    // // let csvStream = csv.createWriteStream({header: true});
    // while (startRestID <= endID) {
    //     chunkOfData = "";
    //     for (let i = startRestID; i <= startRestID + accumulator; i++) {
    //         // let current = [i, faker.company.companyName()];
    //         let current = faker.company.companyName();
    //         chunkOfData += current + '\n';
    //     }
    //     fs.appendFile(
    //         './restaurant.txt', 
    //         chunkOfData,
    //         err => {
    //             if (err) {
    //                 throw err;
    //             }
    //         }
    //     ); 
    //     startRestID += accumulator + 1;
    // }
    // console.log('finished');
};

// generateRestaurant();
//generateRestaurant();  ///////////////////////////////////////invoke func 

//generate menu_section ----------------------------------->
let menuSectionChoice = {
    1: ['The Classics', 'Eggs', 'Juices', 'Coffee'],
    2: ['Salads', 'Sandwitches', 'Burgers','Featured Items', 'Juices'],
    3: ['Starters', 'Mains', 'Dessert', 'Cocktails']
};

let sectionMapping = {
    1: 'Breakfast',
    2: 'Lunch',
    3: 'Dinner'
};

let sectionLengthMapping = {
    1: 4, //4 items
    2: 5, //5 items
    3: 4 //4 items
};

const generateMenuSection = () => {
    let output = [];
    let keys = Object.keys(menuSectionChoice);
    for (let i = 0; i < keys.length; i++) {
        let timeID = keys[i];
        let choices = menuSectionChoice[timeID];
        for (let j = 0; j < choices.length; j++) {
            let current = [choices[j], timeID];
            output.push(current);
        }
    }
    return output;
};

//sqlGenerator ? writeFile('./menuSection.csv', generateMenuSection()) : ''; //invoke func

//generate menu table ------------------------------------->
let name = () => faker.commerce.productName();
let desc = () => faker.lorem.sentence();
let price = () => ('$' + faker.commerce.price());
let photoUrl = () => faker.image.food();

let generateGeneralInfo = (restID) => {
    let output = `${restID}|`;
    output += faker.lorem.words(2) + '|';
    output += faker.lorem.sentence() + '|';
    output += faker.commerce.price() + ',';
    output += photoUrl() + ',';
    return output;
};

let timeId = () => {
    return generateRandomInt(3) + 1; //from 1 to 3
};
let sectionId = (timeID) => {
    let max = sectionLengthMapping[timeID];
    return generateRandomInt(max) + 1;
};
//check this function ------------------------------------->
const generateDish = (restID) => {
    let data = "";
    data += generateGeneralInfo(restID);
    //add meal_time ID for sql, meal_time name for nonsql
    //add meal_section ID for sql, meal_section name for nonsql
    let timeID = timeId();
    let sectionID = sectionId(timeID);
    if (sqlGenerator) {
        data += timeID + ',' + sectionID;
    } else {
        data += sectionMapping[timeID - 1] + ',' + menuSectionChoice[timeID][sectionID - 1];
    }
    return data;
};

let menuCount = 0;
const generateMenu = (noOfChunk) => {
    let filename = sqlGenerator ? './menuSQL.csv' : './menuNonSQL.csv';
    let startRestID = startID;
    let accumulator = Math.floor( ( endID - startID ) / noOfChunk );
    let chunkOfData = "";
    while (startRestID <= endID) {
        let endRestID = Math.min( startRestID + accumulator, endID );
        chunkOfData = ""; 
        for (let restID = startRestID; restID <= endRestID; restID++) {
            let menuData = "";
            let noOfDishes = generateRandomInt(16) + 20; //from 20 - 35
            menuCount += noOfDishes;
            while (noOfDishes > 0) {
                let dish = generateDish(restID);
                menuData += dish + '\n';
                noOfDishes--;
            }
            chunkOfData += menuData;
        }
        appendFile(filename, chunkOfData);
        startRestID = startRestID + accumulator + 1;
    }
};

//generateMenu(20); //generate menus by separating into 20 chunks

//generate menu_dietary table ------------------------------>
//mapping menus with dietary

