document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch('http://localhost:5501/agentLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                // body: JSON.stringify(user),
                body: JSON.stringify({  email, password }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === "success") {
                    alert(`Welcome ${result.name}`);
                    
                    localStorage.setItem('user', JSON.stringify({ name: result.name ,id:result.id }));
                    
                    console.log('Redirecting to profile page...');
                    window.location.href = 'agentprofile.html';
                } else {
                    alert(result.message);
                }
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.message || 'Something went wrong.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');

        }

       

    });
});





