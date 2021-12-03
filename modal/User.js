const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
    },

    category: {
        type: String,
    },

    photo:
    {
        type: String,
    },
    author: {
        type: String
    },
    stock: {
        type: String
    },
    description: {
        type: String
    }
});

const userBook = mongoose.model('Book', userSchema);

module.exports = userBook