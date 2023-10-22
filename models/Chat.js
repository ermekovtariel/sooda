const { Schema, model } = require('mongoose')

const schema = new Schema(
    {
        members: { type: Array },
        title: { type: String }
    },
    { timestamps: true }
)


module.exports = model('Chat', schema)
