// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Ensure this ID matches your form ID in the HTML

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Extract the data from the form
        const email = document.getElementById('emailInput').value; // Ensure this ID matches your email input field ID
        const password = document.getElementById('passwordInput').value; // Ensure this ID matches your password input field ID

        // Construct the request body
        const loginDetails = {
            email,
            password
        };

        try {
            // Send the POST request to the backend login route
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails)
            });

            const data = await response.json();

            // Handle the response from the server
            if (response.ok) {
                alert('Login successful!');
                // Redirect the user to the dashboard page after successful login
                window.location.href = 'dashboard.html'; // Update with the correct dashboard path if different
            } else {
                // If the server responds with an error, display it to the user
                alert(`Login failed: ${data.msg}`);
            }
        } catch (error) {
            // Catch any network errors and log them to the console
            console.error('Login failed:', error);
            alert('Login failed. Please try again later.');
        }
    });
});
