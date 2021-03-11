var express     = require("express"),
    router      = express.Router(),
    middleware  = require("../middleware"),
    Coronavirustimeline = require("../models/coronavirustimeline"),
    Countrydictionary = require("../models/countrydictionary");


/*************************
* Configure for Route
**************************/
router.get("/", function(req, res){
    // For show all opportunitys
    Coronavirustimeline.findOne({}).sort({ gotDate: 'desc'}).exec(function(err, latestCoronavirustimeline){
        if(err) {
            console.log(err);
        } else {
            Countrydictionary.find({}).exec(function(err, latestCountrydictionarys) {
                if(err) {
                    console.log(err);
                } else {
                    res.render("landing", {
                        data: latestCoronavirustimeline.data.results, 
                        countrydictionarys: latestCountrydictionarys,
                        gotDate: latestCoronavirustimeline.gotDate
                    });
                }
            });
        }
    });
});

module.exports = router;