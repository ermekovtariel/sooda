const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    owner: { type: Types.ObjectId, ref: "User" },
    count: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    product: { type: Types.ObjectId, ref: "Product" },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
})

module.exports = model('Busket', schema)
