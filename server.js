const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cargar datos de películas desde movies.json
const moviesFilePath = path.join(__dirname, 'movies.json');
let movies = [];

try {
    const moviesData = fs.readFileSync(moviesFilePath, 'utf8');
    movies = JSON.parse(moviesData);
} catch (error) {
    console.error('Error loading movies data:', error);
}

// Función para guardar películas en el archivo JSON
function saveMovies() {
    fs.writeFile(moviesFilePath, JSON.stringify(movies), (err) => {
        if (err) {
            console.error('Error writing movies file:', err);
        }
    });
}

// Rutas de la API
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

app.get('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const movie = movies.find(movie => String(movie.id) === movieId);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

app.post('/api/movies', (req, res) => {
    const newMovie = req.body;
    movies.push(newMovie);
    saveMovies(); // Guardar la nueva película en el archivo JSON
    res.json(newMovie);
});

// No se necesitan rutas para usuarios en este ejemplo

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
