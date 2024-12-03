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

//consts
const displayResults = document.querySelector('.results');

 //API
 const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkM2IyMWVlOTlmNzMyYjFiMzU5NTE4NzM3MDJmNDU4MiIsIm5iZiI6MTczMzE2MzYxNC4zNzIsInN1YiI6IjY3NGRmYTVlNTYyYjAzMGJiNWFkZTVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SN9C63wqn3Bqd9cEYM8R3nOHOsZMpyMipzF4snctfLs';

 //Event listeners for the Search Button
 document.getElementById('searchBtn').addEventListener('click', function() {
    const searchMedia = document.getElementById('searchMedia').value;

    //
    if (!searchMedia) {
        alert('Please enter a search term');
        return;
    }

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
        const resultsContainer = document.querySelector('.results');
        resultsContainer.innerHTML = ''; //to clear previous results

        //movies results
        if(movieData.results.length > 0){
            movieData.results.forEach(movie => {
                const div = document.createElement('div');
                const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : `placeholder.png`;
                div.innerHTML = `
                <div class="results">
                    <img src="${imageUrl}" alt="${movie.title}" width="200">
                    <h2>${movie.title}</h2>
                    <p>Popularity Vote: ${movie.popularity}</p>
                </div>            
                `;
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.innerHTML += '<p>No movie results found.</p>';
        }

        //tv series results
        if(tvData.results.length > 0){
            tvData.results.forEach(tvShow => {
                const div = document.createElement('div');
                const imageUrl = tvShow.poster_path ? `https://image.tmdb.org/t/p/w200${tvShow.poster_path}` : `placeholder.png`;
                div.innerHTML =  `
                <div class="results">
                    <img src="${imageUrl}" alt="${tvShow.name}" width="200">
                    <h2>${tvShow.name}</h2>
                </div>
                `;
                resultsContainer.appendChild(div);
            });
        } else {
            resultsContainer.innerHTML += '<p>No tv series results found.</p>';
        }
   })
   .catch(error => {
        console.error('Error:', error);
        const resultsContainer = document.querySelector('.results');
        resultsContainer.innerHTML = '<p>An error has occurred. Try later.</p>'
   });
 });