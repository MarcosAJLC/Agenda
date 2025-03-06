const mongoose = require('mongoose')
const homeSchema = new mongoose.Schema({
    titulo: {type: String, require: true },
    descricao: String
})
const homeModel = mongoose.model('Home', homeSchema)

module.exports = homeModel