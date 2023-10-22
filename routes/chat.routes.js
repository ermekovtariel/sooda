const { Router } = require('express')
const Chat = require("../models/Chat")
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post("/", auth, async (req, res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
        title: req.body.title
    });
    try {
        const result = await newChat.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/:userId', auth, async (req, res) => {
    try {
        const chat = await Chat.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/find/:firstId/:secondId', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router