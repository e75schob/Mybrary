const express = require('express')
const req = require('express/lib/request')
const router = express.Router()
const Author = require('../models/authors')



//All authors route
router.get('/', async (req, res) => {
let searchOptions = {}
if (req.query.name != null && req.query.name !==''){ //make sure have name passed to server

searchOptions.name = new RegExp(req.query.name, 'i')//we want to pass name to searchOptions

}

try{

  const authors = await Author.find(searchOptions)//accessing all authors inside this variable
res.render('authors/index', {
  
  authors: authors, 
  searchOptions: req.query
})

} catch{
res.redirect('/')

}




})

//New Author Route
//for displaying the form
router.get('/new', (req, res) => {
res.render('authors/new', {author: new Author()})

})

//Create Author Route

router.post('/', async (req, res) => {


const author = new Author({

    name: req.body.name

})

try{

const newAuthor = await author.save() //save the author in try block
//res.redirect(`authors/${newAuthor.id}`)
res.redirect(`authors`)


}catch {

res.render('authors/new', {
 author: author,
 errorMessage: 'Error creating Author'

})

}


//author.save((err, newAuthor) => {
  //  if (err) {
    //    res.render('authors/new', { //if there is an error want to render authors/new page again
      //      author: author, //line 23-27 referring to
        //    errorMessage: 'Error creating Author'
       // })
  //  } else{
// res.redirect(`authors/${newAuthor.id}`)
       // res.redirect('authors')//if there is no error we want to rediret them to authors/ page.  redirect to authors list view page for now
  //  }
    
  //  })
       
      
 
})
 



module.exports = router