const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    query: { type: String, required: true },
    results: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
