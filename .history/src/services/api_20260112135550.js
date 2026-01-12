// src/services/api.js

const TMDB_API_KEY = '6d0eb9fb2cc59746f4d2de2ecf59d9c9'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

// Sadece bu dillerdeki filmler gelsin (Hint/Asya filmlerini azaltmak için)
const ALLOWED_LANGS = 'en|tr|es|fr|de|it'; 

export const fetchSmartMovieData = async (lang, targetGenreId = null, shownIds = []) => {
  const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const regionCode = lang === 'tr' ? 'TR' : 'US';
 
  const today = new Date().toISOString().split('T')[0]; 
  const minDate = '1960-01-01';

  try {
    let randomPage = Math.floor(Math.random() * 30) + 1;
    
    let url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&language=${apiLang}`;
    
    url += `&primary_release_date.gte=${minDate}&primary_release_date.lte=${today}`;
   
    if (targetGenreId === 'local-tr') {
        url += `&vote_count.gte=10`;
    } else {
        url += `&vote_count.gte=150`;
        url += `&vote_average.gte=5.0`;
    }
    
    if (targetGenreId === 'local-tr') {
        randomPage = Math.floor(Math.random() * 10) + 1; 
        url += `&with_original_language=tr&page=${randomPage}`;
    
    } else if (targetGenreId === 'rom-com') {
        url += `&with_genres=10749,35&with_original_language=${ALLOWED_LANGS}&page=${randomPage}`;

    } else {
        const selectedGenre = targetGenreId 
            ? targetGenreId 
            : HIDDEN_GENRES[Math.floor(Math.random() * HIDDEN_GENRES.length)];
        
        url += `&with_genres=${selectedGenre}&with_original_language=${ALLOWED_LANGS}&page=${randomPage}`;
    }
   
    const response = await fetch(url);
    const json = await response.json();
    
    if (!json.results || json.results.length === 0) return null;
    
    const availableMovies = json.results.filter(movie => !shownIds.includes(movie.id));
    const finalPool = availableMovies.length > 0 ? availableMovies : json.results;
    
    const movie = finalPool[Math.floor(Math.random() * finalPool.length)];
  
    const creditsRes = await fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=${apiLang}`);
    const creditsJson = await creditsRes.json();

    const providerRes = await fetch(`${BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
    const providerJson = await providerRes.json();
    const localProviders = providerJson.results?.[regionCode];

    return { movie, credits: creditsJson, providers: localProviders };

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};