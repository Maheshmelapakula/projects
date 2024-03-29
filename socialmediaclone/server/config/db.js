const mongoose = require('mongoose');
// require('dotenv').config



const connection = mongoose.connect("mongodb+srv://umamahesh:maheshmongodb123@cluster0.ouvzfui.mongodb.net/macMedia")
module.exports = {connection};