const { Router } = require('express')
const Message = require("../models/Message.js")
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post('/', auth, async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const message = new Message({
        chatId,
        senderId,
        text,
    });

    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:chatId', auth, async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await Message.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router