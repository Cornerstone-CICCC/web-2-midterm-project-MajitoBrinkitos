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

 //consts
const displayResults = document.querySelector('.results');

  //API: database
  const apiReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkM2IyMWVlOTlmNzMyYjFiMzU5NTE4NzM3MDJmNDU4MiIsIm5iZiI6MTczMzE2MzYxNC4zNzIsInN1YiI6IjY3NGRmYTVlNTYyYjAzMGJiNWFkZTVhZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SN9C63wqn3Bqd9cEYM8R3nOHOsZMpyMipzF4snctfLs';


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