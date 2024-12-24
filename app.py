from flask import Flask, render_template, jsonify, request, session
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('env')

app = Flask(__name__, static_folder='static')
app.config['OMDB_API_KEY'] = os.getenv('OMDB_API_KEY')
app.secret_key = 'supersecretkey'  # For session management

if not app.config['OMDB_API_KEY']:
    raise ValueError("OMDB_API_KEY not set. Please ensure it is set in the 'env' file or as an environment variable.")

# Fetch movies from OMDb API
def fetch_movies_from_api(query, page=1, year=None, movie_type=None):
    api_key = app.config['OMDB_API_KEY']
    url = f"https://www.omdbapi.com/?s={query}&apikey={api_key}&page={page}"

    # Add optional filters
    if year:
        url += f"&y={year}"
    if movie_type:
        url += f"&type={movie_type}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if data.get("Response") == "True":
            return data
        else:
            return {"error": data.get("Error", "Unknown error")}
    except requests.exceptions.RequestException as e:
        print(f"Error during API request: {e}")
        return {"error": str(e)}

@app.route('/')
def index():
    """Renders the main application page."""
    return render_template('index.html')

@app.route('/api/movies')
def get_movies():
    """API endpoint for fetching movies."""
    query = request.args.get('query', '')
    page = request.args.get('page', 1, type=int)
    year = request.args.get('year', None)
    movie_type = request.args.get('type', None)

    if not query:
        return jsonify({'error': 'Search query is missing'}), 400

    movies_data = fetch_movies_from_api(query, page, year, movie_type)

    if "error" in movies_data:
        return jsonify({'error': movies_data['error']}), 404

    return jsonify(movies_data)

@app.route('/api/favorites', methods=['GET', 'POST', 'DELETE'])
def manage_favorites():
    """Endpoint for managing favorite movies."""
    if 'favorites' not in session:
        session['favorites'] = []

    if request.method == 'GET':
        return jsonify(session['favorites'])

    if request.method == 'POST':
        movie = request.json.get('movie')
        if movie and movie not in session['favorites']:
            session['favorites'].append(movie)
            session.modified = True
            return jsonify({'message': 'Movie added to favorites'}), 201

    if request.method == 'DELETE':
        movie = request.json.get('movie')
        if movie in session['favorites']:
            session['favorites'].remove(movie)
            session.modified = True
            return jsonify({'message': 'Movie removed from favorites'}), 200

    return jsonify({'error': 'Invalid operation'}), 400

if __name__ == '__main__':
    app.run(debug=True)
