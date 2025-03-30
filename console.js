const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root to index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/car_rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});
const User = mongoose.model('User', UserSchema);

// Register User
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Email already exists' });
    }
});

// Login User
app.post('/rent', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Car Schema
const CarSchema = new mongoose.Schema({
    model: String,
    brand: String,
    year: Number,
    pricePerDay: Number,
    available: { type: Boolean, default: true }
});
const Car = mongoose.model('Car', CarSchema);

// Rent a Car
app.post('/rent', async (req, res) => {
    try {
        const { carId } = req.body;
        const car = await Car.findById(carId);
        if (!car || !car.available) {
            return res.status(400).json({ error: 'Car not available' });
        }
        car.available = false;
        await car.save();
        res.json({ message: 'Car rented successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Serve Register and Rent pages
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/rent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rent.html'));
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('Open http://localhost:3000 in your browser');
});