const mongoose = require('mongoose');

const kospiCodeSchema = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    market_code:{
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
        unique : true
    }
})

const KospiCode = mongoose.model("KospiCode", kospiCodeSchema);

module.exports = KospiCode;