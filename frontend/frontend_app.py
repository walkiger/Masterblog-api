from flask import Flask, render_template

# Initialize the Flask application
app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")

@app.route('/', methods=['GET'])
def home():
    """
    Render the home page.
    Returns the HTML content of 'index.html'.
    """
    return render_template("index.html")

if __name__ == '__main__':
    """
    Run the Flask development server.
    The server will be accessible at http://0.0.0.0:5001 and debug mode will be enabled.
    """
    app.run(host="0.0.0.0", port=5001, debug=True)
