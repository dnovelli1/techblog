const leaveComment = async (event) => {
    event.preventDefault();
    const comment_body = document.querySelector('#commentText').value.trim();
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    if (comment_body) {
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