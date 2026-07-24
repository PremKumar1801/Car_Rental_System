// Backend code for Online Car Rental System (console.js)

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/car_rental", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const carSchema = new mongoose.Schema({
  model: String,
  brand: String,
  year: Number,
  pricePerDay: Number,
  available: Boolean,
});

const Car = mongoose.model("Car", carSchema);

app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-car", async (req, res) => {
  const { model, brand, year, pricePerDay, available } = req.body;
  try {
    const newCar = new Car({ model, brand, year, pricePerDay, available });
    await newCar.save();
    res.status(201).json({ message: "Car added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add car" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
