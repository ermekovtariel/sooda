const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    product: { type: Types.ObjectId, ref: "Product" },
})

module.exports = model('PriceDynamic', schema)
