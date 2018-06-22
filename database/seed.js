// const mongoose = require('mongoose');
// const restaurants = require('./data');
// db.MenuModel.insertMany(restaurants);

//Faker, Lorem Ipsum (text) and Lorem Flickr (images) is recommended
const fs = require('fs');
// const db = require('./index'); //require postgreSQL or Cassendra
const faker = require('faker');
const path = require('path');
const csv = require("fast-csv");
const stream = require('stream');

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

//some problems of this function
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
const generateRestaurantWrite = () => {
    // let noOfData = 1000000;
    // let start = startID;
    // console.time('10M data Write to File');
    // for (let i = 0; i < 10; i++) {
    //     console.time('1M data generate');
    //     let chunkOfData = "";
    //     for (let j = start; j < start + noOfData; j++ ) {
    //         chunkOfData += `${faker.lorem.words(2)}\n`;
    //     }
    //     console.timeEnd('1M data generate');
    //     start = start + noOfData;
    //     try {
    //         console.time('Write 1M data to file');
    //         fs.writeFileSync(
    //             `./dummydata/restaurant_${i}.csv`,
    //             chunkOfData
    //         );
    //         console.timeEnd('Write 1M data to file');
    //     } catch (err) {
    //         throw err;
            
    //     }
    // }
    // console.timeEnd('10M data Write to File');
};

const generateRestaurant = () => {
    let noOfRest = 1000000;
    let start = startID;
    let prevFinished = true;
    console.time('10M data Write to File');
    for (let i = 0; i < 10; i++) {
        let chunkOfData = "";
        if (prevFinished) {
            prevFinished = false;
            for (let j = start; j < start + noOfRest; j++ ) {
                chunkOfData += `${faker.lorem.words(2)}\n`;
            }
           prevFinished = appendFile(
               './restaurant.csv',
               chunkOfData
           );
        }
        start = start + noOfRest;
    }
    console.timeEnd('10M data Write to File');
};

//generateRestaurant(); //invoke func

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

let generateGeneralInfo = (restID) => {
    //use push try ------------------------------------------>
    let output = `${restID}|`;
    output += faker.lorem.words(1) + '|'; //dish name
    output += faker.lorem.sentence() + '|'; //desc
    output += '$' + faker.commerce.price() + '|'; //price
    output += 'http://lorempixel.com/640/480/food' + '|';
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
        data += timeID + '|' + sectionID;
    } else {
        data += sectionMapping[timeID - 1] + '|' + menuSectionChoice[timeID][sectionID - 1];
    }
    return data;
};

const generateMenus = (startRestID, range) => {
    let chunkOfData = "";
    for (let i = startRestID; i < startRestID + range; i++) {
        let noOfDishes = generateRandomInt(16) + 20;
        while (noOfDishes > 0) {
            chunkOfData += generateDish(i) + '\n';
            noOfDishes--;
        } 
    }
    return chunkOfData;
};

let menuCount = 0;
const generateMenu = () => {
    let filename = sqlGenerator ? './menuSQL.csv' : './menuNonSQL.csv';
    let noOfRest = 500; //500000
    let start = startID;
    let prevFinished = true;
    let counts = 100000 / noOfRest; //10000000
    let loop = 0;
    console.time('menu data Write to File');

    while (loop < counts) {
        let chunkOfData = "";
        if (prevFinished) {
            prevFinished = false;
            for (let restID = start; restID < start + noOfRest; restID++ ) {
                let noOfDishes = generateRandomInt(16) + 20; //from 20 - 35
                menuCount += noOfDishes;
                while (noOfDishes > 0) {
                    chunkOfData += generateDish(restID) + '\n';
                    noOfDishes--;
                } 
            }
            prevFinished = appendFile(
               './menu.csv',
               chunkOfData
            );
            loop++;
            console.log(prevFinished);
        }
        start += noOfRest;
    }
    console.log(menuCount);
    console.timeEnd('menu data Write to File');
};

let filename = sqlGenerator ? './menuSQL.csv' : './menuNonSQL.csv';
let fileToWrite = fs.createWriteStream(path.resolve('./dummydata', filename));

function generateMenuData(writer) {
    let gap = 1000;
    let i = 1; 
    let end = 10000000; //10000000
    console.time('menu data Write to File');
    write();
    console.timeEnd('menu data Write to File');
    function write() {
      let ok = true;
      do {
        if (i === end) {
          // last time!
          writer.write(generateMenus(i, gap));
        } else {
          // see if we should continue, or wait
          // don't pass the callback, because we're not done yet.
          ok = writer.write(generateMenus(i, gap));
        }
        i += gap;
      } while (i < end && ok);
      if (i < end) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
    
}

//generateMenuData(fileToWrite);

//generateMenu(); //generate menus by separating into 20 chunks

//generate menu_dietary table ------------------------------>
//mapping menus with dietary

const generateMenuDietary = () => {
    let noOfMenus = 10000; //1000000
    let countOfMenus = 20000000; //total menu items estimation //20000000
    let count = countOfMenus / noOfMenus;
    let start = startID;
    let prevFinished = true;
    console.time('MENUDIETARY data Write to File');
    for (let i = 0; i < count; i++) {
        let chunkOfData = [];
        if (prevFinished) {
            prevFinished = false;
            for (let j = start; j < start + noOfMenus; j++ ) {
                let countOfDietary = generateRandomInt(3); //0 - 2
                while (countOfDietary > 0) {
                    let randomIndex = generateRandomInt(4) + 1; // 1 - 4
                    let current = `${j},${randomIndex}\n`;
                    chunkOfData.push(current);
                    countOfDietary--;
                }
            }
           prevFinished = appendFile(
               './menuDiatery.csv',
               chunkOfData.join("")
           );
        }
        start = start + noOfMenus;
    }
    console.timeEnd('MENUDIETARY data Write to File');
};

//generateMenuDietary();

