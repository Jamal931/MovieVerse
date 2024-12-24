# MovieVerse

MovieVerse is a full-stack web application that allows users to search, filter, and view details about movies using data from the OMDb API. It provides a user-friendly interface to explore a vast collection of movies, save API calls, and provides additional functionalities such as trailers, random movies, and movie comparison.

## Features

-  Movie Search: Search for movies by title.
-  Filtering: Filter movies by genre and release year.
-  Movie Details: View detailed information about each movie.
-  Data Persistence: Movie data is cached and persisted in a MongoDB database.
-  Trailer: Watch movie trailers.
-  Random Movie: Get a random movie.
-  Movie Comparison: Compare details of two selected movies side-by-side.
-  Pagination: Efficiently browse through movie search results.
-  Responsive Design: Responsive design for desktop and mobile devices.

## Tech Stack

-   Frontend:
    -   HTML
    -   CSS
    -   JavaScript
    -   Bootstrap
    -   JQuery
-   Backend:
    -   Node.js
    -   Express.js
-   Database:**
    -   MongoDB
-   API Integration:
    -   OMDb API

## Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Jamal931/movieverse.git
    cd movieverse
    ```
   (replace `https://github.com/Jamal931/movieverse.git` with your repository's URL)

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  Create a `.env` file:

    Create a file named `.env` in the root directory and add the following:

    ```env
    MONGODB_URI="mongodb+srv://<your_user>:<your_password>@<your_cluster>/<your_database>?retryWrites=true&w=majority"
    PORT=3000
    OMDB_API_KEY="YOUR_OMDB_API_KEY"
    ```

  

4.  Start the Server:

    ```bash
    node server.js
    ```

5.  Open the Application:

    Open your web browser and go to `http://localhost:3000`.

API Endpoints

*   `GET /api/movies?query={search_query}&page={page_number}`: Search for movies based on the `query` and the `page` to provide pagination support
*   `GET /api/movies/:imdbID`: Fetch detailed movie information given the `imdbID`.

