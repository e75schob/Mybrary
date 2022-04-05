const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({

name: {
    type:String,
    required: true
}

})

module.exports = mongoose.model('Author', authorSchema) //defines a table called Author, what is in table defined by authorSchema