document.addEventListener('DOMContentLoaded', () => {
    const endpoint = 'https://api.cosmic-connect.org/about';
    const aboutContent = document.getElementById('aboutContent');

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Get the response as text
    })
    .then(htmlString => {
        // Parse the fetched HTML string
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Extract the specific content (update the selector to match your target content)
        const mainContent = doc.querySelector('main'); // Assuming the content is within a <main> tag

        if (mainContent) {
            aboutContent.innerHTML = mainContent.innerHTML;
        } else {
            aboutContent.innerHTML = '<p>No content available.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching About content:', error);
        aboutContent.innerHTML = '<p>Error loading content. Please try again later.</p>';
    });
});