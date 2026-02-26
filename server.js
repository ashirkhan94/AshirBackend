const express = require('express');
const User = require('./models/userModel');
const Job = require('./models/jobDataModel');
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



// Create a new job
app.post('/jobs', async (req, res) => {
    try {
        const { title, description, userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId is required'
            });
        }

        const existingJob = await Job.findOne({ userId });

        if (existingJob) {
            existingJob.title = title;
            existingJob.description = description;
            await existingJob.save();

            return res.status(200).json({
                success: true,
                message: 'Job updated successfully',
                job: existingJob
            });
        }

        const job = await Job.create({
            title,
            description,
            userId // reference to User._id
        });

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all users
app.get('/api/getAllusers', async (req, res) => {
    try {
        const users = await User.find(); // fetch all users
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


//add new user
app.post('/api/addusers', async (req, res) => {
    try {
        const { name, email, jobTitle, phoneNumber } = req.body;

        // 🔍 Check if email or phone already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber }
            ]
        });

        if (existingUser) {
            // 🔴 Specific error reason
            if (existingUser.email === email) {
                return res.status(400).json({
                    error: true,
                    reason: "Email already exists"
                });
            }

            if (existingUser.phoneNumber === phoneNumber) {
                return res.status(400).json({
                    error: true,
                    reason: "Phone number already exists"
                });
            }
        }
        const newUser = new User({
            userID: Date.now().toString(),
            name: name,
            email: email,
            jobTitle: jobTitle,
            phoneNumber: phoneNumber
        });

        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});

//delete all users
app.delete('/api/users/clear', async (req, res) => {
    try {
        await User.deleteMany({});
        res.status(200).json({
            message: "All users deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting users",
            error: error.message
        });
    }
});

//update user by userID
/*
const userID = "1707558392834";

    const response = await axios.put(
      `http://localhost:5000/api/users/${userID}`,
      {
        name: "test user",
        email: "testuser@gmail.com",
        jobTitle: "React Native Developer",
        phoneNumber: "9876543210"
      }
    );
*/
app.put('/api/users/:userID', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userID: req.params.userID },
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 4000;
console.log(`Server is running on port `, process.env.PORT);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



