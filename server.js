const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userBook = require('./modal/User')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

var app = express();
app.use(express.json())

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if (allowedFileTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

let upload = multer({ dest: 'images/' });


mongoose.connect(
	'mongodb://localhost:27017/Mynewdb'
	, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useNewUrlParser: true
	})
	.then(res => console.log('db is connected'))
	.catch(err => console.log(err))

const corsOptions = {
	origin: '*',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200,
}

app.use(cors(corsOptions));


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});


app.use(express.static(path.join(__dirname, 'images', 'build')));


app.post('/add', upload.single('photo'), async (req, res) => {
	const name = req.body.name;
	const category = req.body.category;
	const photo = req.body.photo
	const author = req.body.author
	const stock = req.body.stock
	const description = req.body.description
	const newUser = new userBook({
		name,
		category,
		photo,
		author,
		stock,
		description,

	});
	const savedUser = await newUser.save();
	res.json({ msg: savedUser })

});


app.get('/getData', async (req, res) => {
	const existingUser = await userBook.find()
	res.json({ msg: existingUser })

})


app.put('/editbook/:id', async (req, res) => {
	const id = req.params.id;

	const book = await userBook.findById(id);
	if (book) {

		book.name = req.body.name || book.name;
		book.category = req.body.category || book.category;
		book.photo = req.body.photo || book.photo
		book.author = req.body.author || book.author
		book.stock = req.body.stock || book.stock

		const updatedbook = await book.save();
		res.json({
			_id: updatedbook._id,
			name: updatedbook.name,
			category: updatedbook.category,
			photo: updatedbook.photo,
			author: updatedbook.author,
			stock: updatedbook.stock
		});
	}
})


app.get('/edit/:id', function (req, res) {
	const id = req.params.id;
	try {
		userBook.findById(id, function (err, data) {
			res.json(data);
		});
	} catch (err) {
		console.log(err)
	}

});

app.delete('/deleteBook/:id', (req, res) => {
	const id = req.params.id;

	userBook.findByIdAndDelete(id).then((book) => {
		if (!book) {
			return res.status(404).send();
		}
		res.send(book);
	}).catch((error) => {
		res.status(500).send(error);
	})
})

const port = 5000
var server = app.listen(port, function () {
	console.log(`The server is running on port ${port}`);
})