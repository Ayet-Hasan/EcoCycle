document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5501/registerAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                // Handle HTTP errors
                let errorMessage = 'Failed to register. Please try again.';
                try {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch (jsonError) {
                    console.warn('Response is not JSON:', jsonError);
                }
                alert(errorMessage);
                return;
            }

            const result = await response.json();
            console.log(result);
            alert(result.message); // Show success message
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});




