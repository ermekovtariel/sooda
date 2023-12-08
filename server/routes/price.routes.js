const { Router } = require('express')
const Price = require("../models/PriceDynamic")
const Product = require("../models/Product")
const router = Router()

router.post("/change-price", async (req, res) => {
    try {
        const body = req.body
        const priceProduc = await Product.findById(body.product)
        const oldPrice = new Price({
            date: new Date(new Date().setDate(
                new Date().getDate() - 1
            )),
            product: priceProduc._id,
            price: priceProduc.price
        })
        await oldPrice.save()

        const newPrice = new Price({
            ...body,
        })

        await newPrice.save()
        res.status(201)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const priceDynamic = await Price.find({ product: req.params.id, })

        res.json(priceDynamic)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router