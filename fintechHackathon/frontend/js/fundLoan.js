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

// GET route to fetch loan requests for the logged-in user
router.get('/requests', async (req, res) => {
    try {
        const data = await loadData();
        const loanRequests = data.loanRequests || [];

        // Send back the loan requests - filter based on the user if necessary
        // If you want to show only certain loan requests, adjust the filter
        res.json(loanRequests);
    } catch (error) {
        console.error('Error fetching loan requests:', error);
        res.status(500).json({ message: 'Error fetching loan requests', error });
    }
});

// POST route to handle funding of a loan request
router.post('/fund', async (req, res) => {
    // This route would require interaction with the Ethereum network
    // which is beyond the scope of this example. This is a placeholder.
    const { loanId } = req.body;

    try {
        const data = await loadData();
        const loanRequest = data.loanRequests.find(request => request.id === loanId);

        if (!loanRequest) {
            return res.status(404).json({ message: 'Loan request not found' });
        }

        // Assume the user has sufficient funds and wants to fund the loan
        // Update the status of the loan request to indicate it has been funded
        loanRequest.status = 'funded';

        await saveData(data);

        // The actual funding process would involve smart contracts and is not shown here
        res.json({ message: `Loan request ${loanId} funded successfully` });
    } catch (error) {
        console.error('Error funding loan request:', error);
        res.status(500).json({ message: 'Error funding loan request', error });
    }
});



module.exports = router;
