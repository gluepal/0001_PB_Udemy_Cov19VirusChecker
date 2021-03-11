/**************************
* モジュール
**************************/
const express       = require("express"), 
    app             = express(), 
    bodyParser      = require("body-parser"), 
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    https           = require("https"),
    dateFormat      = require('dateformat'),
    fs              = require("fs"),
    cron            = require('node-cron');

// 独自作成
const middleware            = require("./middleware/index.js"),
    Coronavirustimeline     = require("./models/coronavirustimeline");


/**************************
* Mongoose 接続
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
* 最新の感染者数をサイトから取得。
* Cronにより、一定時間経過後に再取得し、
* MonogoDBに保存する。
**************************/
const url           = 'https://lab.isaaclin.cn/nCoV/',
      areaUrl   = url + 'api/area';
      
// schedule get wordpress from web to store mongodb
cron.schedule('0 * * * *', () => {
    // Get Date from china goverment about Coronavirus
    var reqLabArea = https.get(areaUrl, function(res){
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
                    } else {
                        console.log("success store cornavirus to database");
                        // store dictionary to mongodatabase
                        middleware.namedic();
                    }
                });
                
                console.log("Got a response: ", fbResponse.picture);
            } catch (e) {
                console.log("Error Got a HTML : ", e);
            }
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
});

/**************************
* API, css, ejsを設定。
**************************/
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

/**************************
* ルート設定
**************************/
// Mainルート. 初期ページはここにアクセス
var indexRoutes         = require("./routes/index");
app.use("/", indexRoutes);

// 404ルート. ページがない場合、全てここにアクセス。
app.get("*", function(req, res) {
    res.render("404"); 
});


/**************************
* Configure For Listen (HTTPS)
**************************/
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Coronaviurs start!!");
});

