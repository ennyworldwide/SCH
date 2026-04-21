document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Login successful! The server just gave us the secure cookie.
            // Redirect the user to the admin dashboard.
            window.location.href = '/admin.html';
        } else {
            // Login failed. Show the error message.
            document.getElementById('error-msg').style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});