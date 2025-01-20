// Function that runs once the window is fully loaded
window.onload = function() {
    /**
    * Loads the saved API base URL from local storage and sets it in the input field.
    * Does not load posts automatically; allows user to load posts manually.
    */
    // Attempt to retrieve the API base URL from the local storage
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    // If a base URL is found in local storage, set it in the input field
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
    }
};

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    /**
     * Fetch all the posts from the API and display them on the page.
     * Optionally sort the posts based on the 'sort' and 'direction' query parameters.
     */
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    var sortField = document.getElementById('sort-field').value;
    var sortDirection = document.getElementById('sort-direction').value;

    var queryParams = '';
    if (sortField) {
        queryParams += `?sort=${encodeURIComponent(sortField)}`;
    }
    if (sortDirection) {
        queryParams += queryParams ? `&direction=${encodeURIComponent(sortDirection)}` : `?direction=${encodeURIComponent(sortDirection)}`;
    }

    // Use the Fetch API to send a GET request to the /posts endpoint with sorting parameters
    fetch(baseUrl + '/posts' + queryParams)
        .then(response => response.json())
        .then(data => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            // For each post in the response, create a new post element and add it to the page
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <input type="text" id="title-${post.id}" placeholder="New Title" value="${post.title}">
                    <input type="text" id="content-${post.id}" placeholder="New Content" value="${post.content}">
                    <button class="update-button" onclick="updatePost(${post.id})">Update</button>
                    <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
                `;
                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to send a POST request to the API to add a new post
function addPost() {
    /**
    * Sends a POST request to the API to add a new post.
    * Retrieves the values from the input fields for title and content.
    * Reloads the posts after adding a new one and clears the input fields.
    */
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title').value;
    var postContent = document.getElementById('post-content').value;

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())
    .then(post => {
        loadPosts(); // Reload the posts after adding a new one
        document.getElementById('post-title').value = ''; // Clear the input fields
        document.getElementById('post-content').value = ''; // Clear the input fields
    })
    .catch(error => console.error('Error:', error));
}

// Function to send a PUT request to the API to update a post
function updatePost(postId) {
    /**
    * Sends a PUT request to the API to update an existing post.
    * Retrieves the updated values from the input fields for title and content.
    * Reloads the posts after updating one.
    * @param {number} postId - The ID of the post to update.
    */
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById(`title-${postId}`).value;
    var postContent = document.getElementById(`content-${postId}`).value;

    // Use the Fetch API to send a PUT request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent })
    })
    .then(response => response.json())
    .then(post => {
        loadPosts(); // Reload the posts after updating one
    })
    .catch(error => console.error('Error:', error));
}

// Function to send a DELETE request to the API to delete a post
function deletePost(postId) {
    /**
    * Sends a DELETE request to the API to delete an existing post.
    * Reloads the posts after deleting one.
    * @param {number} postId - The ID of the post to delete.
    */
    var baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a DELETE request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => {
        loadPosts(); // Reload the posts after deleting one
    })
    .catch(error => console.error('Error:', error));
}

// Function to send a GET request to the API to search for posts
function searchPosts() {
    /**
    * Sends a GET request to the API to search for posts by title and/or content.
    * Constructs the search query using the values from the input fields for title and content.
    * Displays the search results on the page. */
    var baseUrl = document.getElementById('api-base-url').value;
    var searchTitle = document.getElementById('search-title').value;
    var searchContent = document.getElementById('search-content').value;

    // Construct the search query
    var query = `${baseUrl}/posts/search?title=${encodeURIComponent(searchTitle)}&content=${encodeURIComponent(searchContent)}`;

    // Use the Fetch API to send a GET request to the /posts/search endpoint
    fetch(query)
        .then(response => response.json())
        .then(data => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';

            // For each post in the response, create a new post element and add it to the page
            data.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'post';
                postDiv.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <input type="text" id="title-${post.id}" placeholder="New Title" value="${post.title}">
                    <input type="text" id="content-${post.id}" placeholder="New Content" value="${post.content}">
                    <button class="update-button" onclick="updatePost(${post.id})">Update</button>
                    <button class="delete-button" onclick="deletePost(${post.id})">Delete</button>
                `;
                postContainer.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
