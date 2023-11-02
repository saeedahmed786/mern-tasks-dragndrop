const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    category: { 
        type: String,
        required: [true, "Category is required"],
    },
    user: {
        type: String,
        required: [true, "User is required"],
    },
    date: {
        type: String
    },
    comments: {
        type: [String],
        default: [],
    },
    members: {
        type: [String],
        default: []
    },
});

module.exports = mongoose.model('Todo', todoSchema);
