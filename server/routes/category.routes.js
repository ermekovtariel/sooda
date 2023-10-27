const { Router } = require('express')
const Category = require("../models/Category")
const auth = require('../middleware/auth.middleware')
const Product = require('../models/Product')
const router = Router()

router.get("/", auth, async (req, res) => {
    try {
        const categories = await Category.find({ parent: null })
        res.json(categories)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get("/product-create-halper", auth, async (req, res) => {
    try {

        const categories = await Category.find({ parent: { $ne: null } })
        res.json(categories)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get("/:id", auth, async (req, res) => {
    try {
        const categories = await Category.find({ parent: req.params.id })
        res.json(categories)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.get("/category/:id", auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        const products = await Product.find({ "category.id": category.id })
        res.json({
            category,
            products
        })
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

router.post("/add", auth, async (req, res) => {
    try {
        const { name, hasChildren = false, parent = 0 } = req.body

        const newCategory = new Category({
            name,
            creater: req.user.userId,
            hasChildren,
            parent
        })

        await newCategory.save()
        res.status(201).json(newCategory)

        await Category.findByIdAndUpdate(
            parent,
            { hasChildren: true },
            { new: true }
        )

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

module.exports = router