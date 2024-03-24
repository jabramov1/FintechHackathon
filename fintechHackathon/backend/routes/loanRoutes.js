// loanRoutes.js

const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Assuming your db.json file is in the root directory, one level up from your routes
const dbPath = path.join(__dirname, '..', 'db.json');

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

// POST route to handle a new loan request
router.post('/request', async (req, res) => {
    const { targetWallet, amount, interestRate, timeframe } = req.body;

    // Load the current user and target user data from db.json
    const data = await loadData();

    // Find the user making the request
    const requestingUser = data.users.find(u => u.id === req.session.userId);
    if (!requestingUser) {
        return res.status(401).json({ message: "You must be logged in to make a loan request." });
    }

    // Find the target user by wallet address
    const targetUser = data.users.find(u => u.wallet.address === targetWallet);
    if (!targetUser) {
        return res.status(404).json({ message: "Target wallet not found." });
    }

    // Construct a new loan request object
    const newLoanRequest = {
        id: data.loanRequests.length + 1, // Assuming you're keeping track of loan requests in an array
        fromUserId: requestingUser.id,
        toUserId: targetUser.id,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate),
        timeframe: parseInt(timeframe, 10),
        status: 'pending' // Initial status of the loan request
    };

    // Add the new loan request to your loanRequests array and save it
    data.loanRequests.push(newLoanRequest);
    await saveData(data);

    res.status(201).json({
        message: "Loan request submitted successfully.",
        loanRequest: newLoanRequest
    });
});

router.get('/requests', async (req, res) => {
    try {
        const data = await loadData();
        // Assuming you only want to show loan requests that are pending and to the logged-in user
        const userLoanRequests = data.loanRequests.filter(request => request.toUserId === req.session.userId && request.status === 'pending');
        res.json(userLoanRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loan requests', error });
    }
});

module.exports = router;
