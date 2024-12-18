const bookSchema = require("../model/bookSchema");
const { unlinkSync } = require("fs");

const createBook = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            req.file ? unlinkSync(req.file.path) : null;
            return res.status(403).json({
                success: false,
                message: "Only admin can create books"
            });
        }

        let bookData = new bookSchema({
            ...req.body
        });

        if (req.file) {
            const filePath = `/uploads/${req.file.filename}`;
            bookData.bookImage = filePath;
        }

        const book = await bookData.save();

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });

    } catch (error) {
        req.file ? unlinkSync(req.file.path) : null;

        res.status(500).json({
            success: false,
            message: `Error occurred: ${error.message}`
        });
    }
};
const updateBook = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admin can update books"
            });
        }

        const { bookQuantity } = req.body;

        if (!bookQuantity) {
            return res.status(400).json({
                success: false,
                message: "Book quantity is required"
            });
        }

        const updatedBook = await bookSchema.findByIdAndUpdate(
            req.params.id,
            { bookQuantity },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book quantity updated successfully",
            data: updatedBook
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error occurred: ${error.message}`
        });
    }
};

const getBooks = async (req, res) => {
    try {
        const books = await bookSchema.find();

        if (!books || books.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No books found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error occurred: ${error.message}`
        });
    }


}

const getBookById = async (req, res) => {
    try {
        const book = await bookSchema.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book retrived successfully",
            book: book
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error occurred: ${error.message}`
        });
    }
};

const deleteBook = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete books"
            });
        }

        const book = await bookSchema.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        if (book.bookImage) {
            try {
                unlinkSync(`public${book.bookImage}`);
            } catch (err) {
                console.log("Error deleting image:", err);
            }
        }

        await bookSchema.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error occurred: ${error.message}`
        });
    }
};

module.exports = {
    createBook,
    updateBook,
    getBooks,
    getBookById,
    deleteBook
};
