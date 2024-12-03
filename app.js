 //1.- Sidebar Menu
 //overlay
 document.querySelector('.overlay').addEventListener('click', function() {
    //Sidebar logic goes here
 });

 //support link
 document.getElementById("support").onclick = function () {
    //Simulation of a support link 
     alert("Support Team Link");
 }

 //API
 const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkM2IyMWVlOTlmNzMyYjFiMzU5NTE4NzM3MDJmNDU4MiIsIm5iZiI6MTczMzE2MzYxNC4zNzIsInN1YiI6IjY3NGRmYTVlNTYyYjAzMGJiNWFkZTVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SN9C63wqn3Bqd9cEYM8R3nOHOsZMpyMipzF4snctfLs';

 //Event listeners for the Search Button
 document.getElementById('searchBtn').addEventListener('click', function() {
    const searchMedia = document.getElementById('searchMedia').value;
    const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${searchMedia}`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?query=${searchMedia}`;

//Requesting Access using the Read Access Token: MOVIES
const fetchMovieData = fetch(movieUrl, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiReadAccessToken}`
    }
});

//Requesting Access using the Read Access Token: TV SERIES
const fetchTvData = fetch(tvUrl, {
    method: 'GET',
    headers:{
        'Authorization': `Bearer ${apiReadAccessToken}`
    }
});
    
//Responses
   Promise.all([fetchMovieData, fetchTvData])
   .then(responses => Promise.all(responses.map(response => response.json())))
   .then(([movieData, tvData]) => {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; //to clear previous results

        //movies results
        movieData.results.forEach(movie => {
            const div = document.createElement('div');
            const imageUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            div.innerHTML = `
            <h2>${movie.title}</h2>
            <p>Release Date: ${movie.release_date}</p>
            <img src="${imageUrl}" alt="${movie.title}" width="200">
            `;
            resultsContainer.appendChild(div);
        });

        //tv series results
        tvData.results.forEach(tvShow => {
            const div = document.createElement('div');
            const imageUrl = `https://image.tmdb.org/t/p/w200${tvShow.poster_path}`;
            div.innerHTML =  `
            <h2>${tvShow.name}</h2>
            <p>First Air Date: ${tvShow.first_air_date}</p>
            <img src="${imageUrl}" alt="${tvShow.name}" width="200">
            `;
            resultsContainer.appendChild(div);
        });
   })
   .catch(error => {
        console.error('Error:', error);
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '<p>An error has occurred. Try later.</p>'
   });
 });