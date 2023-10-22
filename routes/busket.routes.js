const { Router } = require('express')
const Busket = require("../models/Busket")
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post("/add", auth, async (req, res) => {
    try {
        const body = req.body.data
        const productId = req.body.product

        await body.forEach(async ({ count, name, image, price, product, color, size }) => {
            try {
                const newBusket = new Busket({
                    owner: req.user.userId,
                    count,
                    color,
                    size,
                    product,

                    price,
                    image,
                    name,
                })

                await newBusket.save()
            } catch (_) { }
        })
        const myFunction = async () => {
            try {
                const products = await Busket.find({ product: productId, owner: req.user.userId })
                const busketCount = await Busket.find({ owner: req.user.userId })

                res.status(201).json({ data: products, busket: busketCount.length })
            } catch (error) {
                return error
            }
        }

        setTimeout(async () => {
            return await myFunction()
        }, 1000);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get("/", auth, async (req, res) => {
    try {
        const busketItems = await Busket.find({ owner: req.user.userId })

        res.status(201).json(busketItems)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post("/:id", auth, async (req, res) => {
    try {
        const updatedBasket = await Busket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        // console.log(updatedBasket);
        res.status(201).json(updatedBasket)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const busketItem = await Busket.findById(req.params.id)
        await busketItem.deleteOne()
        res.status(201).json({ message: "Успешно удалили филиал" })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router