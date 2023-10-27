const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    count: { type: Number, required: true, default: 0 },
    container: { type: Types.ObjectId, ref: "Container" },
    date: { type: Date, default: Date.now },
    owner: { type: Types.ObjectId, ref: "User" },
    image: [{ type: String }],
    description: { type: String },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    category: { type: Object, ref: "Container" }
})

module.exports = model('Product', schema)
