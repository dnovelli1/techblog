const addPost = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#postTitle').value;
    const body = document.querySelector('#post-body').value;
    console.log(body, title);
    const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({
            title,
            body,
        }),
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.new-post').addEventListener('submit', addPost);