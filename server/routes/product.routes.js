const { Router } = require('express')
const { prop } = require('ramda')
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
router.get("/", async (req, res) => {
    if (!prop("userId", prop("user", req))) {
        try {
            const products = await Product.find()
            return res.json(products)
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
        return 0
    }

    if (!!prop("container", prop("query", req))) {
        try {
            const products = await Product.find({ 'container.id': req.query.container })
            return res.json(products)
        } catch (error) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
        return 0
    }
    try {
        const products = await Product.find({
            owner: { $ne: req.user.userId }
        })
        return res.json(products)
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})
router.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.q;

        const products = await Product.find({
            $or:
                [
                    {
                        name: { $regex: searchQuery, $options: "i" },
                        owner: { $ne: req?.user?.userId },
                    },
                    {
                        description: { $regex: searchQuery, $options: "i" },
                        owner: { $ne: req?.user?.userId },
                    },
                    {
                        colors: { $regex: searchQuery, $options: "i" },
                        owner: { $ne: req?.user?.userId },
                    },
                    {
                        sizes: { $regex: searchQuery, $options: "i" },
                        owner: { $ne: req?.user?.userId },
                    },
                    {
                        category: { $value: { $regex: searchQuery, $options: "i" } },
                        owner: { $ne: req?.user?.userId },
                    }
                ]
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