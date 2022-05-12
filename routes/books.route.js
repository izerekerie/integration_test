const express=require('express')
const {check,validationResult}=require('express-validator')
const router=express.Router();
const {save} = require('../services/save.service')
const bookData=require('../data/books.json')

// get all books

router.get('/',(req,res)=>{
    res.json(bookData);
})

//get books by id

router.get('/:bookid',async(req,res)=>{

    const{bookid}=req.params;
    const foundBook=bookData.find((book)=>book.id=bookid);

    if(!foundBook){
        return res.status(404).json({
            error:true,
            message:'Book not found',
        })
    }

    res.status(200).json(foundBook);
})

router.put('/:bookid', (req, res) => {
	const { bookid } = req.params;
	const { name, author } = req.body;
	const foundBook = bookData.find((book) => book.id == bookid);

	if (!foundBook) {
		return res.status(404).send({
			error: true,
			message: 'Book not found'
		});
	}

	let updatedBook = null;

	const updatedBooks = bookData.map((book) => {
		if (book.id == bookid) {
			updatedBook = {
				...book,
				name,
				author
			};

			return updatedBook;
		}

		return book;
	});

	const isSaved = save(updatedBooks);

	if (!isSaved) {
		return res.status(500).json({
			error: true,
			message: 'could not save book'
		});
	}

	res.status(201).json(updatedBook);
});
// delete book by id

router.delete('/:bookid',async(req,res)=>{
const {bookid}= req.params;
const foundBook= bookData.find((book)=>book.id=bookid);

if(!foundBook){
    res.status(404).send({
        error:true,
        message:'Book not found'
    })
}

let updatedBooks= bookData.filter((book)=>book.id=bookid);

const isSaved=save(updatedBooks);
if(!isSaved){
    return res.status(500).json({
        error:true,
        message:'could not save the book'
    })
}
res.status(201).json({
    message:'Book deleted successfully'
})

})

// post book

router.post('/', [
    check('name','Book name is required').not().isEmpty(),
    check('author','Author name is required').not().isEmpty(),
], (req,res)=>{
const errors=validationResult(req)
if(!errors.isEmpty()){
    return res.status(400).json({
        errors:errors.array()
    });
}
const {name,author}=req.body;
bookData.push({name,author,id:Math.random()})
const isSaved=save(bookData);
if(!isSaved){
    return res.status(500).json({
        error:true,
        message:'could not save book'
    })};
    res.json({message:'Success'})

})
module.exports=router;