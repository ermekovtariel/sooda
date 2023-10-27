const { Router } = require('express')
const Container = require("../models/Container")
const auth = require('../middleware/auth.middleware')
const router = Router()


router.post("/add", auth, async (req, res) => {
    try {
        const { name } = req.body

        const newContainer = new Container({
            name, owner: req.user.userId
        })
        await newContainer.save()
        res.status(201).json({ container: newContainer })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const container = await Container.findById(req.params.id)
        await container.deleteOne()
        res.status(201).json({ message: "Успешно удалили филиал" })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get("/", auth, async (req, res) => {
    try {
        const containers = await Container.find({ owner: req.user.userId })
        res.json(containers)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router