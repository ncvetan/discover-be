const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    parentId: { type: String, required: true },
    author: { type: String, minLength: 1, maxLength: 50, required: true },
    rating: { type: Number, min: 1, max: 10, required: true },
    description: { type: String, maxLength: 500 },
});

module.exports = mongoose.model('Review', ReviewSchema);
