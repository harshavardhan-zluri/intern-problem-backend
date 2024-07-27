import mongoose from "mongoose"

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

export default mongoose.model('Expense', expenseSchema)