// src/services/api.js

const TMDB_API_KEY = 'SENIN_API_ANAHTARIN'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

// Parametreye 'targetGenreId' ekledik (Varsayılan null)
export const fetchSmartMovieData = async (lang, targetGenreId = null) => {
  const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const regionCode = lang === 'tr' ? 'TR' : 'US';

  try {
    // EĞER hedef tür geldiyse onu kullan, YOKSA rastgele havuzdan seç
    const selectedGenre = targetGenreId 
        ? targetGenreId 
        : HIDDEN_GENRES[Math.floor(Math.random() * HIDDEN_GENRES.length)];

    // Rastgelelik hissi için sayfa numarasını değiştiriyoruz
    const randomPage = Math.floor(Math.random() * 20) + 1;

    // 1. Film Çek
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre}&page=${randomPage}&language=${apiLang}&sort_by=popularity.desc`
    );
    const json = await response.json();
    
    if (!json.results || json.results.length === 0) return null;
    
    // Gelen sayfadan rastgele bir film seç
    const movie = json.results[Math.floor(Math.random() * json.results.length)];

    // 2. Oyuncuları Çek
    const creditsRes = await fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=${apiLang}`);
    const creditsJson = await creditsRes.json();

    // 3. Platform Bilgisini Çek
    const providerRes = await fetch(`${BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
    const providerJson = await providerRes.json();
    const localProviders = providerJson.results?.[regionCode];

    return { movie, credits: creditsJson, providers: localProviders };

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};