/**************************
* Configure For Express and the others.
**************************/
const express       = require("express"), 
    app           = express();
    
// First App
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Coronaviurs start!!");
});
