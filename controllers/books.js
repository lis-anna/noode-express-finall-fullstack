const Book = require('../models/Book');
const StatusCodes = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllBooks = async (req, res) => {
  const books = await Book.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ books, count: books.length });
};

const getBook = async (req, res) => {
  const {
    user: { userId },
    params: { id: bookId },
  } = req;

  const book = await Book.findOne({ _id: bookId, createdBy: userId });
  if (!book) {
    throw new NotFoundError(`Not found book with id ${bookId}`);
  }
  res.status(StatusCodes.OK).json({ book });
};

const addBook = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const book = await Book.create(req.body);
  res.status(StatusCodes.CREATED).json({ book });

  res.json(req.body);
};

const updateBook = async (req, res) => {
  const {
    body: { title, author },
    user: { userId },
    params: { id: bookId },
  } = req;
  if (author === '' && title === '') {
    throw new BadRequestError('Please provide book author and title');
  }
  /* if (author === '' && title !== '') {
    throw new BadRequestError('Please provide book author');
  }
  if (author !== '' && title === '') {
    throw new BadRequestError('Please provide book title');
  }*/
  const book = await Book.findByIdAndUpdate(
    { _id: bookId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!book) {
    throw new NotFoundError(`Not found book with id ${bookId}`);
  }
  res.status(StatusCodes.OK).json({ book });
};

const deleteBook = async (req, res) => {
  const {
    user: { userId },
    params: { id: bookId },
  } = req;

  const book = await Book.findOneAndRemove({ _id: bookId, createdBy: userId });

  if (!book) {
    throw new NotFoundError(`Not found book with id ${bookId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Deleted' });
};

module.exports = {
  getAllBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
};
