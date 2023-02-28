const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      minlength: 2,
      maxlength: 100,
    },
    author: {
      type: String,
      required: [true, 'Please provide book author'],
      minlength: 2,
      maxlength: 100,
    },
    isbn: {
      type: String,
      required: [true, 'Please provide ISBN'],
      match: [
        /^(?=.*[0-9]).{9,15}$/,
        'Please provide a ISBN value, 9 to 15 digits.',
      ],
      minlength: 9,
      maxlength: 15,
    },
    bookIllustrator: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 100,
    },
    numOfPages: {
      type: Number,
      required: false,
    },
    bookPublisher: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 100,
    },
    publishedDate: {
      type: Date,
      required: false,
    },
    ageCategory: {
      type: String,
      enum: [
        '0 to 2',
        'preschool',
        '3 to 5',
        ' mid school age',
        'uncategorized',
      ],
      default: 'uncategorized',
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['on hands', 'coming soon', 'unavailable', 'available', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);
