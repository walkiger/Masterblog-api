from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

POSTS = [
    {"id": 1, "title": "First Post", "content": "This is the first post."},
    {"id": 2, "title": "Second Post", "content": "This is the second post."},
]


@app.route('/api/posts', methods=['GET'])
def get_posts():
    """
    Fetch all posts. Optionally, sort the posts based on query parameters 'sort' and 'direction'.
    - sort: Field to sort by ('title' or 'content').
    - direction: Sorting order ('asc' or 'desc').
    """
    sort_field = request.args.get('sort')
    direction = request.args.get('direction')

    if sort_field and direction:
        if sort_field not in ['title', 'content']:
            return jsonify({"error": "Invalid sort field. Use 'title' or 'content'."}), 400
        if direction not in ['asc', 'desc']:
            return jsonify({"error": "Invalid sort direction. Use 'asc' or 'desc'."}), 400

        reverse = direction == 'desc'
        sorted_posts = sorted(POSTS, key=lambda x: x[sort_field], reverse=reverse)
    else:
        sorted_posts = POSTS

    return jsonify(sorted_posts)


@app.route('/api/posts', methods=['POST'])
def add_post():
    """
    Add a new post. The request body must contain 'title' and 'content'.
    """
    data = request.get_json()

    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Title and content are required."}), 400

    new_id = max(post['id'] for post in POSTS) + 1 if POSTS else 1
    new_post = {
        "id": new_id,
        "title": data['title'],
        "content": data['content']
    }
    POSTS.append(new_post)

    return jsonify(new_post), 201


@app.route('/api/posts/<int:id>', methods=['PUT'])
def update_post(id):
    """
    Update an existing post by ID. The request body may contain 'title' and/or 'content'.
    """
    data = request.get_json()

    post = next((post for post in POSTS if post['id'] == id), None)
    if post is None:
        return jsonify({"error": "Post not found."}), 404

    post['title'] = data.get('title', post['title'])
    post['content'] = data.get('content', post['content'])

    return jsonify(post), 200


@app.route('/api/posts/<int:id>', methods=['DELETE'])
def delete_post(id):
    """
    Delete an existing post by ID.
    """
    post = next((post for post in POSTS if post['id'] == id), None)
    if post is None:
        return jsonify({"error": "Post not found."}), 404

    POSTS.remove(post)
    return jsonify({"message": f"Post with id {id} has been deleted successfully."}), 200


@app.route('/api/posts/search', methods=['GET'])
def search_posts():
    """
    Search for posts by title and/or content. Query parameters 'title' and 'content' are optional.
    """
    title = request.args.get('title', '').lower()
    content = request.args.get('content', '').lower()

    filtered_posts = [
        post for post in POSTS
        if (title in post['title'].lower() if title else True) and (
            content in post['content'].lower() if content else True)
    ]

    return jsonify(filtered_posts)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
