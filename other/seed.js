/**************************
* Configure For Express and the others.
**************************/
const express       = require("express"), 
    app             = express(), 
    mongoose        = require("mongoose"),
    https           = require("https"),
    fs              = require("fs");
    
// Created Model
const Coronavirustimeline     = require("./models/coronavirustimeline");

/**************************
* Mongoose Connection
**************************/
// Get content from file
var connecturl;
if(process.env.MONGO_SECRET) {
    connecturl = process.env.MONGO_SECRET;
} else {
    var contents = fs.readFileSync("./secret/password.json");
    var jsonContent = JSON.parse(contents);
    connecturl = jsonContent.mongoose_connection;
}

// connect use connectUrl
mongoose.connect(connecturl, function(err, db){
    if(err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
        process.exit(1);
    } else {
        console.log('Connected to Server successfully!');
    }
});

/**************************
* Get coronavirus data from DXY-2019-nCoV-Crawler
**************************/
const url           = 'https://lab.isaaclin.cn/nCoV/',
      areaUrl       = url + 'api/area';
      
const req = https.get(areaUrl, function(res){
    var body = '';
    var dateTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"});

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        try {
            var fbResponse = JSON.parse(body);
            var newCoronavirustimeline = {
                cornavirusoverall: fbResponse,
                gotDate: dateTime,
            }
            // create a new shopuser and save to DB.
            Coronavirustimeline.create(newCoronavirustimeline, function(err, newlyCreated){
                if(err) {
                    console.log("Got store cornavirus to database error : " + err);
                    process.exit(1);
                } else {
                    console.log("success store cornavirus to database");
                    process.exit(0);
                }
            });
        } catch (e) {
            console.log("Error : ", e);
            process.exit(1);
        }
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
      process.exit(1);
});
// リクエストを閉じる。
req.end();


