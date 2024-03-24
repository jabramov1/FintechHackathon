// requestLoan.js

document.addEventListener('DOMContentLoaded', () => {
    const loanRequestForm = document.getElementById('loanRequestForm'); // Ensure this ID matches your form ID in the HTML

    loanRequestForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Extract the data from the form fields
        const targetWallet = document.getElementById('targetWalletInput').value;
        const amount = document.getElementById('loanAmountInput').value;
        const interestRate = document.getElementById('interestRateInput').value;
        const timeframe = document.getElementById('timeFrameInput').value;


        // Construct the request payload
        const loanRequestDetails = {
            targetWallet,
            amount,
            interestRate,
            timeframe
        };

        try {
            // Send the POST request to your server's endpoint for loan requests
            const response = await fetch('/api/loan/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include', // Necessary for including the session cookie
                body: JSON.stringify(loanRequestDetails)
            });

            const responseData = await response.json();

            // Handle the response from the server
            if (response.ok) {
                alert('Loan request submitted successfully!');
                // Here you could redirect to another page or update the UI accordingly
            } else {
                // If the server responds with an error, display it to the user
                alert(`Loan request failed: ${responseData.message}`);
            }
        } catch (error) {
            // Catch any network errors and log them to the console
            console.error('Loan request failed:', error);
            alert('Loan request failed. Please try again later.');
        }
    });
});

