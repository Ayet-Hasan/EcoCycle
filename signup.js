// document.getElementById('signupForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent the form from refreshing the page

//     const name = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('http://localhost:5501/registerCollector', {
//             method: 'POST',
//             // mode: 'no-cors',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ name, email, password }),
//         });

//         if (response.ok) {
//             alert('Signup successful!');
//         } else {
//             alert('Signup failed. Please try again.');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred. Please try again.');
//     }
// });






document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // ডিফল্ট সাবমিট আটকানো

        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5501/registerCollector', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                // Handle HTTP errors
                const error = await response.json();
                alert(error.message || 'Failed to register. Please try again.');
                return;
            }


            const result = await response.json();
            console.log(result);
            alert(result.message); // সফল মেসেজ দেখানো
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
