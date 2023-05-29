const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

// Set up multer for form data parsing
const upload = multer();

// Setup middlewares
app.use(upload.none());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

mongoose
	.connect("mongodb://localhost:27017/book-crud-angular", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

const bookSchema = new mongoose.Schema({
	title: String,
	author: String,
	year: Number,
	editorial: String,
}, { versionKey: false });

const Book = mongoose.model("Book", bookSchema);

// C reate - Add new books
app.post("/books", async (req, res) => {
	try {
		const { title, author, year, editorial } = req.body;
		console.log(req.body);
		const book = new Book({ title, author, year, editorial });
		await book.save();
		res.status(201).json(book);
	} catch (error) {
		res.status(500).json({ error: "Unable to add book" });
	}
});

// R ead - Get list of all books
app.get("/books", async (req, res) => {
	try {
		const books = await Book.find();
		res.json(books);
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch books" });
	}
});

// U pdate - Edit existing books
app.put("/books/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { title, author, year, editorial } = req.body;
		const book = await Book.findByIdAndUpdate(
			id,
			{ title, author, year, editorial },
			{ new: true }
		);
		res.json(book);
	} catch (error) {
		res.status(500).json({ error: "Unable to update book" });
	}
});

// D elete - Delete existing books
app.delete("/books/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await Book.findByIdAndDelete(id);
		res.sendStatus(204);
	} catch (error) {
		res.status(500).json({ error: "Unable to delete book" });
	}
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
