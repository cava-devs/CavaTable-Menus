
const csv = require("fast-csv");

csv.writeToPath("./dummydata/test.csv", [
       [1, "b1,c"],
       [2, "b2, 5"],
       [3, "b3 9"]
   ], {headers: false})
   .on("finish", function(){
       console.log("done!");
   });