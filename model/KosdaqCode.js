const mongoose = require('mongoose');

const kosdaqCodeSchema = new mongoose.Schema({
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

const KosdaqCode = mongoose.model("KosdaqCode", kosdaqCodeSchema);

module.exports = KosdaqCode;