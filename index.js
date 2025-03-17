const mongoose= require("mongoose");

// mongoose.connect(config.connectionString);

const Transaction=require("./models/Transaction.model");

const express = require("express");
const cors = require("cors");
// const {authenticateToken} = require("./utilities");
const app = express();
// const jwt=require("jsonwebtoken");
app.use(express.json());

app.use(cors({
    origin:"*"
})
);

app.post("/add-transaction", async (req, res) => {
    const { amount, date, description } = req.body;
    // const { user } = req.user;

    const formattedDate = date ? new Date(date) : null;
    if (formattedDate) {
        formattedDate.setHours(0, 0, 0, 0);
    }

    if (!amount || !date) {
        return res.status(400).json({ error: true, message: "Amount and Date are required" });
    }

    try {
        const transaction = new Transaction({
            amount,
            date:formattedDate,
            description,
            // userId: user._id, // Ensure the note is linked to the user
        });
        await transaction.save();

        return res.json({
            error: false,
            transaction,
            message: "Transaction added successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

app.get("/get-all-transaction", async (req, res) => {
    // const { user } = req.user;

    try {
        const Transactions = await Transaction.find();
        return res.json({
            error: false,
            Transactions,
            message: "Transaction fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});
app.put("/update-transaction/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, date, description } = req.body;
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        id,
        { amount, date, description },
        { new: true } // Return updated document
      );
  
      if (!updatedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      res.json({ message: "Transaction updated successfully", updatedTransaction });
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  app.delete("/delete-transaction/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTransaction = await Transaction.findByIdAndDelete(id);
  
      if (!deletedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });



mongoose
  .connect(
    `mongodb+srv://akashdevadiga919:b86AgQurWwJbh7nR@cluster0.eb2qr.mongodb.net/finance?retryWrites=true&w=majority&appName=Cluster0`
    // `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eb2qr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    // `mongodb+srv://akashdevadiga919:j6ShctabFo2Ozdmt@cluster0.0nxas.mongodb.net/notesapp?retryWrites=true&w=majority&appName=Cluster0`
  )
//   mongodb+srv://akashdevadiga919:b86AgQurWwJbh7nR@cluster0.eb2qr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  .then(() => {
    app.listen(process.env.PORT||5000);
  })
  .catch(err => {
    console.log(err);
  });

  module.exports =app;