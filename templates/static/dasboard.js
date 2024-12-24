<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function () {
        let currentPage = 1;
        let currentQuery = "";
        let filters = {
            genre: "",
            yearStart: "",
            yearEnd: "",
        };
        let totalPages = 1;
        let selectedMovies = [null, null];
        let selectedMovieIndex = null;

          // Function to update filters
        function updateFilters() {
            filters.genre = $('#genre-filter').val();
            filters.yearStart = $('#year-start').val();
            filters.yearEnd = $('#year-end').val();
        }


        $('#random-movie-button').on('click', function () {
            console.log("Random Movie button clicked");
            fetchMovies("", 1, true);
        });

        $('#compare-movie-button').on('click', function () {
             console.log("Compare button clicked");
            if ($("#compare-section").is(":visible")) {
                $('#compare-section').hide();
            } else {
                $('#compare-section').show();
            }
        });

        $('#clear-filters').on('click', function () {
             console.log("Clear Filters button clicked");
            $('#genre-filter').val("");
            $('#year-start').val("");
            $('#year-end').val("");
             filters = {
                genre: "",
                yearStart: "",
                yearEnd: "",
            };
             $('#movie-table-body').empty();
             $('#loading-spinner').hide();
             renderPagination();
        });

         $('#genre-filter').on('change', function () {
              console.log("Genre filter changed");
              updateFilters();
         });
         $('#year-start').on('change', function () {
              console.log("year start filter changed");
              updateFilters();
         });
         $('#year-end').on('change', function () {
              console.log("year end filter changed");
              updateFilters();
         });


        $('#search-button').on('click', function () {
           console.log("Search button clicked");
            const query = $('#movie-query').val().trim();
            if (query.length > 0 || currentQuery.length > 0 || filters.genre || filters.yearStart || filters.yearEnd) {
                 console.log("search query is: ", query)
                $('#loading-spinner').show();
                currentQuery = query;
                fetchMovies(query, currentPage);
            } else {
                $('#movie-table-body').empty();
                $('#loading-spinner').hide();
                renderPagination();
            }
        });

        $('#prev-page').on('click', function () {
             console.log("Previous page button clicked");
            if (currentPage > 1) {
                currentPage--;
                fetchMovies(currentQuery, currentPage);
            }
        });

        $('#next-page').on('click', function () {
             console.log("Next page button clicked");
            if (currentPage < totalPages) {
                currentPage++;
                fetchMovies(currentQuery, currentPage);
            }
        });


        function fetchMovies(query, page, random = false) {
            console.log("fetchMovies called with query:", query, "page:", page, "random:", random);
             updateFilters();
             if (query.length === 0 && !filters.genre && !random) {
                 console.log("query is empty");
            $('#movie-table-body').empty();
             $('#loading-spinner').hide();
             renderPagination();
              return;
            }
            $('#loading-spinner').show();
             let url = `/api/movies?query=${query}&page=${page}`;
           if (random) {
              url = `/api/movies?query=${query}&page=${Math.ceil(Math.random() * 10)}`;
            }
            console.log("Fetching URL:", url)
           $.get(url, function (data) {
                 console.log("API response:", data);
                const movies = data.Search || [];
                 totalPages = Math.ceil(data.totalResults / 10);
                $('#loading-spinner').hide();
                 if (random) {
                     populateRandomMovieDetails(movies);
                 } else {
                   populateMovieTable(movies);
                }
                 renderPagination();
             }).fail(function (jqXHR, textStatus, errorThrown) {
                   console.error("API failed with:", textStatus, errorThrown);
                    $('#loading-spinner').hide();
                alert(`Error fetching movie data: ${textStatus}, ${errorThrown}`);
                   $('#movie-table-body').empty();
                    renderPagination();
             });
        }

        function populateMovieTable(movies) {
            console.log("populating movie table", movies)
           const tableBody = $('#movie-table-body');
             tableBody.empty();

            if (movies.length === 0) {
                tableBody.append('<tr><td colspan="5" class="text-center">No movies found</td></tr>');
                return;
            }

            movies.forEach(function (movie) {
                let filtered = true;
                  if (filters.genre && movie.Genre && !movie.Genre.split(", ").includes(filters.genre)) filtered = false;
                if (filters.yearStart && movie.Year && parseInt(movie.Year) < parseInt(filters.yearStart)) filtered = false;
                if (filters.yearEnd && movie.Year && parseInt(movie.Year) > parseInt(filters.yearEnd)) filtered = false;

                if (filtered) {
                    tableBody.append(`
                    <tr class="movie-row">
                         <td><a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank"><img src="${movie.Poster}" alt="${movie.Title}"></a></td>
                        <td>${movie.Title}</td>
                        <td>${movie.Year}</td>
                        <td>${movie.Type}</td>
                       <td><button class="btn btn-info btn-sm" data-movie-id="${movie.imdbID}" onclick="toggleMovieDetails(this)">Details</button>
                         <button class="btn btn-primary btn-sm" onclick="selectMovieForComparisonWithMovie('${movie.Title}', '${movie.imdbID}', '${movie.Poster}', '${movie.Year}', '${movie.Type}')">Add to Compare</button>

                         </td>
                        </tr>
                         <tr class="movie-details-row" id="movie-details-${movie.imdbID}" style="display: none;">
                            <td colspan="5">
                                <div id="movie-details-content-${movie.imdbID}">Loading...</div>
                           </td>
                        </tr>
                    `);
                }
            });
        }


        function populateRandomMovieDetails(movies){
             console.log("populating random movie table", movies)
             const randomMovie = movies[Math.floor(Math.random() * movies.length)];
              if(!randomMovie) {
                   alert("No movies found for these filters")
                   return;
            }

              $('#movie-table-body').empty();

                $('#movie-table-body').append(`
                    <tr class="movie-row">
                         <td><a href="https://www.imdb.com/title/${randomMovie.imdbID}/" target="_blank"><img src="${randomMovie.Poster}" alt="${randomMovie.Title}"></a></td>
                        <td>${randomMovie.Title}</td>
                        <td>${randomMovie.Year}</td>
                        <td>${randomMovie.Type}</td>
                       <td><button class="btn btn-info btn-sm" data-movie-id="${randomMovie.imdbID}" onclick="toggleMovieDetails(this)">Details</button>

                       </tr>
                       <tr class="movie-details-row" id="movie-details-${randomMovie.imdbID}" style="display: none;">
                            <td colspan="5">
                                <div id="movie-details-content-${randomMovie.imdbID}">Loading...</div>
                           </td>
                        </tr>
                    `);

         }


        window.toggleMovieDetails = async function (button) {
            const movieId = button.getAttribute('data-movie-id');
            const detailsRow = document.getElementById(`movie-details-${movieId}`);
            const detailsContent = document.getElementById(`movie-details-content-${movieId}`);
            console.log("toggle movie details clicked", movieId);

            if (detailsRow.style.display === 'none') {
                detailsRow.style.display = 'table-row';
                detailsContent.innerHTML = "Loading...";
                try {
                    const apiKey = '851058c8';
                    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
                    if (!response.ok)
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    const details = await response.json();

                    detailsContent.innerHTML = `
                                <div class="movie-details-container">
                                    <img src="${details.Poster}" alt="Movie Poster" style="max-height: 150px;" />
                                <div>
                                    <h2>${details.Title}</h2>
                                        <p><strong>Year:</strong> ${details.Year}</p>
                                        <p><strong>Rated:</strong> ${details.Rated}</p>
                                        <p><strong>Released:</strong> ${details.Released}</p>
                                        <p><strong>Runtime:</strong> ${details.Runtime}</p>
                                        <p><strong>Genre:</strong> ${details.Genre}</p>
                                        <p><strong>Director:</strong> ${details.Director}</p>
                                        <p><strong>Actors:</strong> ${details.Actors}</p>
                                       <p><strong>Plot:</strong> ${details.Plot}</p>
                                    </div>
                                </div>
                            `;

                } catch (error) {
                   console.error("error fetching movie details", error)
                   detailsContent.innerHTML = `Failed to load details: ${error.message}`;
                }

            } else {
                 detailsRow.style.display = 'none';
            }

        }
           // Pagination rendering
        function renderPagination() {
              const prevButton = $('#prev-page');
            const nextButton = $('#next-page');
             prevButton.prop('disabled', currentPage === 1);
             nextButton.prop('disabled', currentPage >= totalPages);
        }

        window.selectMovieForComparison = function (index) {
              console.log("selectMovieForComparison called with index: ", index)
             selectedMovieIndex = index;
        }

         window.selectMovieForComparisonWithMovie = function (movieTitle, imdbID, moviePoster, movieYear, movieType) {
             console.log("selectMovieForComparisonWithMovie called:", movieTitle, imdbID)
             if (!selectedMovieIndex) {
                alert("Please select the movie you want to overwrite in the compare section.");
                return;
            }

             selectedMovies[selectedMovieIndex - 1] = {
                title: movieTitle,
                 imdbID: imdbID,
                poster: moviePoster,
                 year: movieYear,
                 type: movieType
            };
             let selectedMovie = selectedMovies[selectedMovieIndex - 1]
             $(`#movie-${selectedMovieIndex}-card`).html(`
             <img src="${selectedMovie.poster}" alt="${selectedMovie.title}" style="max-height: 150px;" />
                <h3>${selectedMovie.title}</h3>
                 <p><strong>Year:</strong> ${selectedMovie.year}</p>
                 <p><strong>Type:</strong> ${selectedMovie.type}</p>

                 <button class="btn btn-primary btn-sm" onclick="selectMovieForComparison(${selectedMovieIndex})">Select another Movie </button>

              `);
              selectedMovieIndex = null;
         }
    });
</script>
