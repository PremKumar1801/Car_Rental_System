const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5002;

// MongoDB Connection
const MONGO_URI = "mongodb+srv://harsh:I5BZPHl20OtInfaS@cluster0.isxfhss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, 
)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.error('MongoDB Connection Failed ❌', err));

// Simple Route
app.get('/', (req, res) => {
  res.send('MongoDB is Connected! 🚀');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));