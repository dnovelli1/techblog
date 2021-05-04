const loginFormHandler = async (event) => {
    event.preventDefault();
    console.log('hello world');

    const username = document.querySelector('#usernameLog').value.trim();
    const password = document.querySelector('#passwordLog').value.trim();

    if (username && password) {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            console.log('***********************************');
            alert(response.statusText);
        }
    }
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);