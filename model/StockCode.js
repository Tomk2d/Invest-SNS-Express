const mongoose = require('mongoose');

const stockCodeSchema = new mongoose.Schema({
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
    },
    market :{
        type : String,
        required : true
    }
})

const StockCode = mongoose.model("StockCode", stockCodeSchema);

module.exports = StockCode;
