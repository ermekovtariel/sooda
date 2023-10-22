const { Router } = require('express')
const Product = require("../models/Product")
const auth = require('../middleware/auth.middleware')
const router = Router()

router.post("/add", auth, async (req, res) => {
    try {
        const body = req.body

        const newProduct = new Product({
            ...body,
            owner: req.user.userId
        })
        await newProduct.save()

        res.status(201).json({ product: newProduct })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.post("/:id", auth, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(201).json(updatedProduct)
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get("/", auth, async (req, res) => {
    try {
        if (req?.query?.container) {
            const products = await Product.find({ container: req.query.container })
            return res.json(products)
        }

        const products = await Product.find({
            owner: { $ne: req.user.userId }
        })
        res.json(products)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.q;

        const products = await Product.find({
            name: { $regex: searchQuery, $options: "i" },
            owner: { $ne: req?.user?.userId },
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Произошла ошибка при выполнении поиска" });
    }
});
router.delete("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        await product.deleteOne()
        res.status(201).json({ message: "Успешно удалили продукт" })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})


module.exports = router