const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    amount: { type: String, required: true },
    date: { 
        type: Date, 
        default: () => {
            const today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Removes time
        },
        set: (value) => {
            const date = new Date(value);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Ensures time is stripped
        }
    },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
