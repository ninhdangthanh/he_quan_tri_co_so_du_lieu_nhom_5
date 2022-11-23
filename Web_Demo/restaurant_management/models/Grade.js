const mongoose = require('mongoose')

const GradeSchema = new mongoose.Schema({
    restaurant_id: String,
    date: Date,
    grade: String,
    score: Number
})


module.exports = mongoose.model('Grade', GradeSchema)