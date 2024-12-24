$(document).ready(function() {
    $("#search-button").click(function() {
        var query = $("#search-bar").val();
        if (query.trim() === "") {
            alert("Please enter a movie name.");
            return;
        }
        searchMovies(query);
    });

    function searchMovies(query) {
        $.ajax({
            url: `/api/movies?query=${query}`,
            method: 'GET',
            success: function(data) {
                if (data.Response === "True") {
                    populateMovieDetails(data.Search);
                    populateLeaderboard(data.Search);
                } else {
                    alert("No results found!");
                      $("#movie-details").html('');
                    $("#leaderboard tbody").html('');
                }
            },
             error: function(error) {
                console.error("Error fetching data: ", error);
                 $("#movie-details").html('');
                $("#leaderboard tbody").html('');
             }
        });
    }

   function populateMovieDetails(movies) {
        let detailsHTML = '';
        movies.forEach(function(movie) {
          const poster = movie.Poster === "N/A" ? "No Image" : movie.Poster;
            detailsHTML += `
                <div class="movie-card">
                     ${poster === "No Image" ? "<p>No Image</p>" : `<img src="${poster}" alt="${movie.Title}">`}
                    <h3>${movie.Title || 'N/A'}</h3>
                    <p>Year: ${movie.Year || 'N/A'}</p>
                    <p>Type: ${movie.Type || 'N/A'}</p>
                    <p><a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">View on IMDb</a></p>
                </div>
            `;
        });
        $("#movie-details").html(detailsHTML);
    }

   function populateLeaderboard(movies) {
        let leaderboardHTML = '';
        movies.forEach(function(movie) {
             const rating = movie.imdbRating || "N/A"
            leaderboardHTML += `
                <tr>
                    <td>${movie.Title || "N/A"}</td>
                    <td>${movie.Year || "N/A"}</td>
                   <td>${rating}</td>
                </tr>
            `;
        });
        $("#leaderboard tbody").html(leaderboardHTML);
    }
});