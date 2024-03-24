// dashboard.js
document.addEventListener('DOMContentLoaded', function () {
    async function fetchUserData() {
        try {
            // Fetch user data from the server
            const response = await fetch('/api/auth/profile', {
                method: 'GET',
                credentials: 'include', // To include the session cookie
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Failed to fetch user data. Status: ${response.status}, Body: ${errorBody}`);
            }

            const userData = await response.json();

            // Display the user's name using the part before the "@" in their email
            const userName = userData.email.split('@')[0];
            document.getElementById('userName').textContent = `Welcome, ${userName}`;

            // Update the displayed balance
            document.getElementById('accountBalance').textContent =
                userData.wallet ? `$${userData.wallet.balance.toFixed(2)}` : '$0.00';

            // Clear and update the recent transactions list
            const recentTransactionsList = document.getElementById('recentTransactions');
            recentTransactionsList.innerHTML = '';

            // Ensure userData.transactions is an array before attempting to loop through
            if (Array.isArray(userData.transactions)) {
                userData.transactions.forEach(tx => {
                    const li = document.createElement('li');
                    li.textContent = `${tx.date} - ${tx.description} - $${tx.amount}`;
                    recentTransactionsList.appendChild(li);
                });
            } else {
                // If no transactions are available, display a message or leave it empty
                const noTransactionsItem = document.createElement('li');
                noTransactionsItem.textContent = 'No recent transactions';
                recentTransactionsList.appendChild(noTransactionsItem);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data. Please check console for details.');
        }
    }

    // Call the function to fetch and display the user data
    fetchUserData();
});
