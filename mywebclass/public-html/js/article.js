document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        displayError('Article not found.');
        return;
    }

    fetch(`https://api.cosmic-connect.org/jsonapi/node/article/${articleId}?include=field_image`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayArticle(data);
    })
    .catch(error => {
        console.error('Error fetching article:', error);
        displayError('Error loading article. Please try again later.');
    });
});

function displayArticle(data) {
    const articleTitle = document.getElementById('articleTitle');
    const articleBody = document.getElementById('articleBody');
    const articleImage = document.getElementById('articleImage');

    // Check if the data contains the necessary attributes
    if (!data || !data.data || !data.data.attributes) {
        displayError('Invalid article data.');
        return;
    }

    // Set article title and body
    articleTitle.textContent = data.data.attributes.title || 'Untitled Article';
    articleBody.innerHTML = data.data.attributes.body?.value || '<p>No content available.</p>';

    // Check if the article has an image in the relationships
    if (data.data.relationships?.field_image?.data) {
        const imageId = data.data.relationships.field_image.data.id;
        const image = data.included?.find(inc => inc.id === imageId);

        if (image && image.attributes?.uri?.url) {
            const imageUrl = `https://api.cosmic-connect.org${image.attributes.uri.url}`;
            articleImage.src = imageUrl;
            articleImage.alt = data.data.attributes.title || 'Article Image';
            articleImage.style.display = 'block'; // Show the image once it is set
        } else {
            articleImage.style.display = 'none'; // Hide the image if not found
        }
    } else {
        articleImage.style.display = 'none'; // Hide the image if no image relationship exists
    }
}

function displayError(message) {
    const articleBody = document.getElementById('articleBody');
    articleBody.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}