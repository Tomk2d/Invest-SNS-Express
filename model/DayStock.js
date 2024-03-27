const mongoose = require('mongoose');

const dayStockSchema = new mongoose.Schema(
    {
        codeId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "StockCode"
        },
        stockCode : {
            type : String,
            required: true,
            unique: true,
        },
        price : [{
            open :{
                type : Number,
                required: true,
            },
            close :{
                type : Number,
                required: true,
            },
            high :{
                type : Number,
                required: true,
            },
            low :{
                type : Number,
                required: true,
            },
            volume :{
                type : Number,
                required: true,
            },
            date :{
                type : String,
                required: true,
            },
        }],
    }
);



const DayStock = mongoose.model("DayStock", dayStockSchema);

module.exports = DayStock;
