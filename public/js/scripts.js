document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/movies')
        .then(response => response.json())
        .then(movies => {
            const movieList = document.getElementById('movie-list');
            if (movieList) {
                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.className = 'col-md-4 movie-card';
                    movieCard.innerHTML = `
                        <div class="card">
                            <img src="${movie.image}" class="card-img-top movie-img" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.synopsis}</p>
                                <p class="card-text">Rating: ${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)}</p>
                                <a href="movie-detail.html?id=${movie.id}" class="btn btn-primary">Ver más</a>
                            </div>
                        </div>
                    `;
                    movieList.appendChild(movieCard);
                });
            }
        })
        .catch(error => console.error('Error fetching movies:', error));

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        fetch(`/api/movies/${movieId}`)
            .then(response => response.json())
            .then(movie => {
                document.getElementById('movie-title').textContent = movie.title;
                const movieDetails = document.getElementById('movie-details');
                movieDetails.innerHTML = `
                    <div class="card">
                        <img src="${movie.image}" class="card-img-top movie-img" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.synopsis}</p>
                            <p class="card-text">Rating: ${'★'.repeat(movie.rating)}${'☆'.repeat(5 - movie.rating)}</p>
                        </div>
                    </div>
                `;
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    const addMovieForm = document.getElementById('add-movie-form');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const synopsis = document.getElementById('synopsis').value;
            const rating = parseInt(document.getElementById('rating').value, 10);
            const image = document.getElementById('image').value;

            fetch('/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, synopsis, rating, image })
            })
            .then(response => response.json())
            .then(movie => {
                alert('Película agregada correctamente');
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Error adding movie:', error));
        });
    }

    const userId = 1; // Supongamos que el ID del usuario es 1
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            const profileInfo = document.getElementById('profile-info');
            const ratedMoviesList = document.getElementById('rated-movies');
            if (profileInfo) {
                profileInfo.innerHTML = `<p>Username: ${user.username}</p>`;
            }
            if (ratedMoviesList) {
                user.ratedMovies.forEach(rating => {
                    const movie = movies.find(m => m.id === rating.movieId);
                    if (movie) {
                        const li = document.createElement('li');
                        li.innerHTML = `${movie.title} - Rating: ${rating.rating} - Comment: ${rating.comment}`;
                        ratedMoviesList.appendChild(li);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching user profile:', error));
        
        // Filtrar películas por búsqueda de título
        document.getElementById('search-input').addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            const movieCards = document.querySelectorAll('.movie-card');
            movieCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                if (title.includes(searchValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }); 
});
