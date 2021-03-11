const mongoose = require("mongoose");

const CoronavirustimelineSchema = new mongoose.Schema({
    data: Object,
    gotDate: Date,
});

module.exports = mongoose.model("Coronavirustimeline", CoronavirustimelineSchema);