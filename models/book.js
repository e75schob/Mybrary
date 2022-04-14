const mongoose = require("mongoose")
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'


const bookSchema = new mongoose.Schema({

title: {
    type:String,
    required: true
},

description: {
    type: String
  
},

publishDate: {
    type: Date,
    required: true
},

pageCount: {
  
    type: Number,
    required:true
},

createdAt:{
  
    type: Date,
    required: true,
    default:Date.now
},

coverImageName: {
type: String,
required: true

},

author: {
   
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'//must reference Author created in Author Schema
}

})

bookSchema.virtual('coverImagePath').get(function() {
//don't use an arrow function because we went to get access to the this property of book itself
if (this.coverImageName != null){
    //if it is not null we want to get the get public uploads book folder
    return path.join('/', coverImageBasePath, this.coverImageName)
    //return root of path that is the public folder append actual name of the file folder that is this.coverImageName
}
})

module.exports = mongoose.model('Book', bookSchema) //defines a table called Book, what is in table defined by bookSchema

module.exports.coverImageBasePath = coverImageBasePath

