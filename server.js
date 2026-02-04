const express = require('express');
const User = require('./models/userModel');
const cors = require('cors');

const app = express();

app.use(cors());

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected ✅'))
    .catch(err => console.log(err));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Node backend 🚀 how are you');
});

app.get('/api/userData', (req, res) => {
    const userData = {
        name: "John Doe",
        age: 30,
        email: "john.doe@example.com"
    };
    res.json(userData);
});

app.get('/api/users', (req, res) => {
    const users = [{ name: 'Ashir', age: 20 }, { name: 'John', age: 25 }];
    res.json(users);
})
app.post('/api/user', (req, res) => {
    const newUser = req.body;
    res.json({ message: 'User created successfully', user: newUser });
})


app.post('/addusers', async (req, res) => {
    try {
        const { name, email, age } = req.body; // ✅ get data from request body
        const user = await User.create({ name, email, age });
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
const PORT = process.env.PORT || 4000;
console.log(`Server is running on port `, process.env.PORT);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

