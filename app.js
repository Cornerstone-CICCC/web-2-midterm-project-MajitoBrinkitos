 //dark-light mode
 document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('bd-theme');
    const themeOptions = document.querySelectorAll('[data-bs-theme-value]');

    //user's theme preference
    const currentTheme = localStorage.getItem('theme');
    if(currentTheme){
        document.documentElement.setAttribute('data-bs-theme', currentTheme);
        document.getElementById('bd-theme-text').innerText = `Toggle theme (${currentTheme})`;
    }

    //Theme toggle button
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-bs-theme-value');
            document.documentElement.setAttribute('data-bs-theme', theme);
            document.getElementById('bd-theme-text').innerText = `Toggle theme (${theme})`;
            localStorage.setItem('theme', theme);

            //update button
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
 });
 
 //Sidebar Menu
 //overlay
 document.querySelector('.overlay').addEventListener('click', function() {
    //Sidebar logic goes here
 });

 //support link
 document.getElementById("support").onclick = function () {
    //Simulation of a support link 
     alert("Support Team Link");
 };

 //login
 document.getElementById("login").onclick = function () {
    //Simulation of a login link
    alert("Successful Login");
 };

 //signup
 document.getElementById("signup").onclick = function () {
    //Simulation of a signup link
    alert("Successful Signup");
 }

 //consts
const displayResults = document.querySelector('.results');

  //API: database
  const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkM2IyMWVlOTlmNzMyYjFiMzU5NTE4NzM3MDJmNDU4MiIsIm5iZiI6MTczMzE2MzYxNC4zNzIsInN1YiI6IjY3NGRmYTVlNTYyYjAzMGJiNWFkZTVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SN9C63wqn3Bqd9cEYM8R3nOHOsZMpyMipzF4snctfLs';

  const apiKey = 'd3b21ee99f732b1b35951873702f4582';


 //API: video
const fetchDisplayVideo = (movieId, modalId) => {
    const videoUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

    fetch(videoUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiReadAccessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.querySelector(`#${modalId} .modal-body`); //.video-container
        if(data.results.length > 0){
            const video = data.results.find(v => v.type === 'Trailer');
            if(video){
                const videoSrc = `https://www.youtube.com/embed/${video.key}`;
                videoContainer.innerHTML = `<iframe width="560" height="315" src="${videoSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = '<p>No trailer available</p>';
            } 
        } else {
                videoContainer.innerHTML = '<p>No video available</p>';
            }
    })
    .catch(error => {
        console.error('Error fetching video:', error);
        const videoContainer = document.querySelector(`#${modalId} .modal-body`); //.video-container
        videoContainer.innerHTML = '<p>Error fetching video</p>';
    });
};

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
            movieData.results.forEach((movie, index) => {
                const div = document.createElement('div');
                const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : `placeholder.png`;
                const modalId = `modal${index + 1}`;
                div.innerHTML = `
                <div class="results">
                    <div class="card">
                        <img class="card-img" src="${imageUrl}" alt="${movie.title}" width="200">
                        <div class="card-body">
                            <h2 class="card-title">${movie.title}</h2>
                                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#${modalId}" onclick="fetchDisplayVideo(${movie.id}, '${modalId}')">
                                    Watch Trailer
                                </button>
                                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="${modalId}Label">${movie.title} - Trailer</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
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
                    <div class="card">
                        <img src="${imageUrl}" alt="${tvShow.name}" width="200">
                        <div class="card-body">
                            <h2 class="card-title">${tvShow.name}</h2>
                        </div>
                    </div>
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


 //New Releases - Rated movies
 const fetchTopRatedMovies = () => { 
    const topRatedMoviesUrl = 'https://api.themoviedb.org/3/movie/top_rated';
    
    fetch(topRatedMoviesUrl, { 
        method: 'GET', 
        headers: { 
            'Authorization': `Bearer ${apiReadAccessToken}` 
        }
     })
      .then(response => response.json())
    .then(data => { 
        const resultsContainer = document.querySelector('.container .results');
         resultsContainer.innerHTML = ''; 
         
         if (data.results.length > 0) { 
            data.results.forEach(movie => { 
                const div = document.createElement('div'); 
                const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'placeholder.png'; 
                div.classList.add('movie-card'); 
                div.innerHTML = ` 
                <img src="${imageUrl}" alt="${movie.title}" width="200"> 
                <h2>${movie.title}</h2> 
                <p>Rating: ${movie.vote_average}</p> 
                <p>Release Date: ${movie.release_date}</p> 
                `;
                 resultsContainer.appendChild(div); 
                }); 
            } else { 
                resultsContainer.innerHTML = '<p>No top-rated movies found.</p>'; 
            }
        }) 
        .catch(error => { 
            console.error('Error fetching top-rated movies:', error); 
            const resultsContainer = document.querySelector('.container .results'); 
            resultsContainer.innerHTML = '<p>An error has occurred. Please try again later.</p>'; 
        }); 
    }; // Fetch and display the top-rated movies on page load 
    document.addEventListener('DOMContentLoaded', () => { 
        fetchTopRatedMovies(); 
    });

//TV series
const fetchTvSeries = () => { 
    const tvSeries = 'https://api.themoviedb.org/3/tv/popular';
    
    fetch(tvSeries, { 
        method: 'GET', 
        headers: { 
            'Authorization': `Bearer ${apiReadAccessToken}` 
        }
     })
      .then(response => response.json())
    .then(data => { 
        const resultsContainer = document.querySelector('.container .results');
         resultsContainer.innerHTML = ''; 
         
         if (data.results.length > 0) { 
            data.results.forEach(series => { 
                const div = document.createElement('div'); 
                const imageUrl = series.poster_path ? `https://image.tmdb.org/t/p/w200${series.poster_path}` : 'placeholder.png'; 
                div.classList.add('series-card'); 
                div.innerHTML = ` 
                <img src="${imageUrl}" alt="${series.title}" width="200"> 
                <h2>${series.title}</h2> 
                <p>Rating: ${series.vote_average}</p> 
                <p>Release Date: ${series.first_air_date}</p> 
                `;
                 resultsContainer.appendChild(div); 
                }); 
            } else { 
                resultsContainer.innerHTML = '<p>No tv series found.</p>'; 
            }
        }) 
        .catch(error => { 
            console.error('Error fetching tv series:', error); 
            const resultsContainer = document.querySelector('.container .results'); 
            resultsContainer.innerHTML = '<p>An error has occurred. Please try again later.</p>'; 
        }); 
    }; // Fetch and display the top-rated movies on page load 
    document.addEventListener('DOMContentLoaded', () => { 
        fetchTvSeries(); 
    });