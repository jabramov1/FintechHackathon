
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Extract data from the form
        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const confirmPassword = document.getElementById('confirmPasswordInput').value;

        // Simple client-side validation for matching passwords
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Construct the user object to send
        const user = {
            name,
            email,
            password
        };

        try {
            // Send the POST request to the backend
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            // Handle the response from the server
            if (response.ok) {
                alert(`Signup successful! Welcome ${name}!`);
                // Redirect the user to the login page or dashboard after successful signup
                window.location.href = 'login.html';
            } else {
                // If the server responds with an error, display it to the user
                alert(`Signup failed: ${data.msg}`);
            }
        } catch (error) {
            // Catch any network errors and log them to the console
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again later.');
        }
    });
});
