const leaveComment = async (event) => {
    event.preventDefault();
    const comment_body = document.querySelector('#commentText').value.trim();
    // Takes the url in the window and splits, then takes the window location and splits subtracting everything after the last /
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    if (comment_body) { // If the comment exists
        const response = await fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_body,
            }),
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
};
document.querySelector('.new-comment').addEventListener('submit', leaveComment);