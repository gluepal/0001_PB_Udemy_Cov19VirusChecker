var express     = require("express"),
    router      = express.Router(),
    mongoose    = require("mongoose"),
    Coronavirustimeline = require("../models/coronavirustimeline");
    
// for translate
const dic = require("../other/dic");

/*************************
* Configure for Route
**************************/
router.get("/", function(req, res){
    // For show all opportunitys
    Coronavirustimeline.findOne({}).sort({ gotDate: 'desc'}).exec(function(err, latestCoronavirustimeline){
        if(err) {
            console.log(err);
        } else {
            res.render("landing", {
                coronavirustimelines: latestCoronavirustimeline.cornavirusoverall.results, 
                dic: dic,
                gotDate: latestCoronavirustimeline.gotDate
            });
        }
    });
});

module.exports = router;