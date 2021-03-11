/**************************
* Configure For Express and the others.
**************************/
const express       = require("express"), 
    app             = express(), 
    bodyParser      = require("body-parser"), 
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
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
* Require For Route
**************************/
var indexRoutes         = require("./routes/index");

/**************************
* Configure for API, css, ejs...
**************************/
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

/**************************
* Configure For Routes
**************************/
app.use("/", indexRoutes);

/**************************
* Redirect Not Found Page
**************************/
app.get("*", function(req, res) {
    res.render("404"); 
});

/**************************
* Configure For Listen (HTTPS)
**************************/
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Coronaviurs start!!");
});

