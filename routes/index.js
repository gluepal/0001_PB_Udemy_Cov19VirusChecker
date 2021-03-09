var express     = require("express"),
    router      = express.Router(),
    Coronavirustimeline = require("../models/coronavirustimeline");

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
                gotDate: latestCoronavirustimeline.gotDate
            });
        }
    });
});

module.exports = router;