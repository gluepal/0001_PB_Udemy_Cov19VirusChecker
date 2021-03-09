var express     = require("express"),
    router      = express.Router(),
    Wptimeline = require("../models/wptimeline"),
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
            Wptimeline.findOne({}).sort({ gotDate: 'desc'}).exec(function(err, latestWptimeline){ 
                if(err) {
                    console.err("Wptimeline err: " + err);
                } else {
                    Countrydictionary.find({}).exec(function(err, latestCountrydictionarys) {
                        if(err) {
                            console.log(err);
                        } else {
                            res.render("landing", {
                                wptimelines: latestWptimeline.wpPostsAll, 
                                coronavirustimelines: latestCoronavirustimeline.cornavirusoverall.results, 
                                countrydictionarys: latestCountrydictionarys,
                                gotDate: latestCoronavirustimeline.gotDate
                            });
                        }
                    });
                }
            });
            // res.render("landing", {coronavirustimelines: latestCoronavirustimeline.cornavirusoverall.results, gotDate: latestCoronavirustimeline.gotDate});
        }
    });
});

module.exports = router;