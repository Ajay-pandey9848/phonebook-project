
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  }
});

const Contact = mongoose.model("Contact", contactSchema);

// Home route
app.get("/", (req, res) => {
  res.send("Phonebook backend is running!");
});

// Get all contacts
app.get("/api/persons", async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch contacts" });
  }
});

// Add a contact
app.post("/api/persons", async (req, res) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({
        error: "Name and phone number are required"
      });
    }

    const contact = new Contact({ name, number });
    const savedContact = await contact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({
      error: "Unable to save contact"
    });
  }
});

// Delete a contact
app.delete("/api/persons/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({
      error: "Unable to delete contact"
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
