document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data from an API endpoint (replace 'your-api-endpoint' with the actual endpoint)
        const response = await fetch('/.netlify/functions/user');

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        // Parse the JSON response
        const data = await response.json();

        // Append data to the body tag
        const body = document.querySelector('body');

        data.forEach(user => {
            const userElement = document.createElement('h3');
            userElement.textContent = `${user.id} : ${user.name}`; // Adjust this based on your user object structure
            body.appendChild(userElement);
        });

    } catch (error) {
        console.error('Error fetching and appending data:', error);
    }
});