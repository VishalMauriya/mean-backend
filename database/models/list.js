const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title : {
        type : String,
        minlenght : 3,
        trim : true
    }
});

const List = mongoose.model('List', ListSchema);

module.exports = List;