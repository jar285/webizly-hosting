document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('newsGrid');

    // Determine the category based on a data attribute on the body
    const pageCategory = document.body.dataset.category; // e.g., 'ufo', 'space', 'uap'

    // Function to fetch articles from the Drupal API with an optional category filter
    function fetchArticles(category = '') {
        let url = 'https://api.cosmic-connect.org/jsonapi/node/article?include=field_image';

        // Add category filter if a category is specified
        if (category) {
            url += `&filter[field_category.name]=${encodeURIComponent(category)}`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include' // Include cookies if required
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayArticles(data);
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            alert('Error fetching articles. Please try again later.');
        });
    }

    // Function to display articles in the news grid
    function displayArticles(data) {
        newsGrid.innerHTML = ''; // Clear existing content

        data.data.forEach(item => {
            // Default placeholder image
            let imageUrl = 'https://via.placeholder.com/400x250';

            // Check if field_image exists in relationships
            if (item.relationships?.field_image?.data) {
                const imageId = item.relationships.field_image.data.id;
                const image = data.included?.find(inc => inc.id === imageId);

                if (image && image.attributes?.uri?.url) {
                    imageUrl = `https://api.cosmic-connect.org${image.attributes.uri.url}`;
                }
            }

            // Get the article title
            const title = item.attributes.title || 'Untitled Article';

            // Get the article summary
            const summary = item.attributes.body?.summary || 'No summary available.';

            // Create article card with conditional content
            const articleCard = document.createElement('div');
            articleCard.classList.add('news-card');

            // If pageCategory is defined (category pages), display the summary
            if (pageCategory) {
                articleCard.innerHTML = `
                    <div class="news-image" style="background-image: url('${imageUrl}');"></div>
                    <div class="news-content">
                        <h3 class="news-text">${title}</h3>
                        <p class="news-summary">${summary}</p>
                        <a href="article.html?id=${item.id}" class="read-more">Read More</a>
                    </div>
                `;
            } else {
                // For index.html, display only the image, title, and "Read More" link
                articleCard.innerHTML = `
                    <div class="news-image" style="background-image: url('${imageUrl}');"></div>
                    <div class="news-content">
                        <h3 class="news-text">${title}</h3>
                        <a href="article.html?id=${item.id}" class="read-more">Read More</a>
                    </div>
                `;
            }

            newsGrid.appendChild(articleCard);
        });
    }

    // Fetch articles when the page loads with the optional category filter
    if (newsGrid) {
        fetchArticles(pageCategory);
    }
});