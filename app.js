const express = require('express')
const config = require('config')
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose')

const app = express()
app.use(cors());

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./server/routes/auth.routes'))
app.use('/api/products', require('./server/routes/product.routes'))
app.use('/api/containers', require('./server/routes/container.routes'))
app.use('/api/busket', require('./server/routes/busket.routes'))
app.use('/api/categories', require('./server/routes/category.routes'))
app.use('/api/price', require('./server/routes/price.routes'))

app.use('/chat', require('./server/routes/chat.routes'))
app.use('/message', require('./server/routes/message.routes'))

const PORT = config.get('port') || 5000

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`ПОРТ ${PORT}`))

    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}



start()