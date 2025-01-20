// Function that runs once the window is fully loaded
window.onload = function() {
    // Attempt to retrieve the API base URL from the local storage
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    // If a base URL is found in local storage, set it in the input field
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
    }
};

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    // Use the Fetch API to send a GET request to the /posts endpoint
    fetch(baseUrl + '/posts')
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
    // Retrieve the values from the input fields
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
