const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    hasChildren: { type: Boolean, default: false },
    parent: { type: String, default: "0" },
    creater: { type: Types.ObjectId, ref: "User" }
})

module.exports = model('Category', schema)
