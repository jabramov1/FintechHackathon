const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto'); // Added for wallet generation

const router = express.Router();
const dbPath = path.join(__dirname, '../db.json'); // Adjust the path to where your db.json is located



// Helper function to load the data from the JSON file
const loadData = async () => {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
};

// Helper function to save data to the JSON file
const saveData = async (data) => {
    const dataToSave = JSON.stringify(data, null, 2);
    await fs.writeFile(dbPath, dataToSave, 'utf8');
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loadData();

        if (data.users.some(user => user.email === email)) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate a unique crypto wallet address
        const walletAddress = '0x' + crypto.randomBytes(20).toString('hex');
        const mockBalance = Math.floor(Math.random() * 1000); // Mock balance
        const mockTransactions = []; // Start with an empty transaction history

        // Mock transaction data could be added here if needed

        const newUser = {
            id: data.users.length + 1,
            email,
            password, // Note: In a real application, hash the password before storing it
            wallet: {
                address: walletAddress,
                balance: mockBalance,
                transactions: mockTransactions
            }
        };

        data.users.push(newUser);
        await saveData(data);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                wallet: newUser.wallet
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loadData();

        const user = data.users.find(u => u.email === email && u.password === password);
        if (user) {
            req.session.userId = user.id; // Set session userId to the logged-in user's ID
            res.json({ message: 'Logged in successfully', userId: user.id });
        } else {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error logging in' });
    }
});

// Example profile route to fetch user data based on session userId
router.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const data = await loadData();
    const user = data.users.find(u => u.id === req.session.userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Return user data, excluding password
    const { id, email, wallet } = user;
    res.json({ id, email, wallet });
});

module.exports = router;
