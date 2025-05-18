const mongoose = require("mongoose");
const mongo_uri = process.env.MONGO_URI;
const connection = mongoose.connect(mongo_uri);

module.exports = connection;