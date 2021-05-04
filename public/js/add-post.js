const addPost = async (event) => {
    event.preventDefault();
    // Grabs input values 
    const title = document.querySelector('#postTitle').value;
    const body = document.querySelector('#post-body').value;
    console.log(body, title);
    const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({ //Converts to strings
            title, 
            body,
        }),
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        document.location.replace('/dashboard'); // When response is successful, replace the dashboard 
    } else {
        alert(response.statusText);
    }
};
// When the form is submitted, trigger the function
document.querySelector('.new-post').addEventListener('submit', addPost);