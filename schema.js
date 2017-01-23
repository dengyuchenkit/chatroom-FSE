var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	name: String,
	chat: String,
	time: Date
});