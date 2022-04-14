const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/authors')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
//array has all different image types we accept

const upload = multer({

dest: uploadPath,
fileFilter:(req, file, callback) => {

callback(null, imageMimeTypes.includes(file.mimetype))

}

})



//All Books route
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != ''){
    query = query.regex('title',new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != ''){
    query = query.lte('publishDate',req.query.publishedBefore)
  }

   if (req.query.publishedAfter != null && req.query.publishedAfter != ''){
    query = query.gte('publishDate',req.query.publishedAfter)
  }

try{
  const books = await query.exec()

  
  res.render('books/index', {
books: books,
searchOptions: req.query
  })

}catch{

res.redirect('/')

}


})



//New Book Route
//for displaying the form
router.get('/new', async(req, res) => {

 renderNewPage(res, new Book())


})

//Create Book Route

router.post('/', upload.single('cover'),async (req, res) => {//upload a single file on server named cover that will put it in folder
  const fileName = req.file != null ? req.file.filename : null //if file name is not equal to null we will get the file name for it, getting filenname from file, then use file to set coverImageName.

  const book = new Book({
title: req.body.title,
author: req.body.author,
publishDate: new Date(req.body.publishDate),
pageCount: req.body.pageCount,
coverImageName: fileName,
description: req.body.description


})

try {

const newBook = await book.save()//if book saves correctly we redirect to the books page
//res.redirect(`books/$(newBook.id)`)
res.redirect('books')
}catch {

  if (book.coverImageName != null){
  removeBookCover(book.coverImageName)
  }
  renderNewPage(res,book, true)//true because it has an error or will have an error

}


})


function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath, fileName), err => {//removes fileName we don't want and pass to the server the path
    if (err) console.error(err)

  })
}

async function renderNewPage(res, book, hasError = false){//pass in response variable, pass in new or existing book, pass in errorMessage sometimes have error message from server
try{

  const authors = await Author.find({})//if error getting authors redirect to book page if not render authors and render book
const params = {//in order to dynamically render the error message, we create a params variable.  set params variable equal to params we send to server

  authors: authors,
  book:book


}



if (hasError) params.errorMessage = 'Error Creating Book'//we wanna add dynamically to this params variable if we have an error
res.render('books/new', params)

}catch {
res.redirect('/books')

}

}





module.exports = router