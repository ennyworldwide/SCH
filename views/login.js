document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = e.target.querySelector('button');
    btn.textContent = "Verifying...";
    btn.disabled = true;

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
            const result = await response.json();
            
            // Redirect based on role
            if (result.role === 'lecturer') {
                window.location.href = '/admin.html'; // Admins go to dashboard
            } else if (result.role === 'student') {
                window.location.href = '/'; // Students go directly back to homepage
            }
        } else {
            document.getElementById('error-msg').style.display = 'block';
            btn.textContent = "Sign In";
            btn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        btn.textContent = "Sign In";
        btn.disabled = false;
    }
});