const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    book_name: String,
    song_name: String,
    song_content: String,
    song_id: String
});

module.exports = mongoose.model('Songs', userSchema);