const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: "USD"
    }
})

module.exports = mongoose.model('Expense', expenseSchema)