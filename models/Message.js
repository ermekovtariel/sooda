const { Schema, model } = require('mongoose')

const schema = new Schema(
    {
        chatId: { type: String },
        senderId: { type: String },
        text: { type: String },
    },
    { timestamps: true, }
)


module.exports = model('Message', schema)
