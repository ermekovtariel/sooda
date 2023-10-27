const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    products: [{ type: Types.ObjectId, ref: 'Product' }],
})

module.exports = model('User', schema)
