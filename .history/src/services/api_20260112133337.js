// src/services/api.js

const TMDB_API_KEY = '6d0eb9fb2cc59746f4d2de2ecf59d9c9'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

// 1. DİL FİLTRESİ (Hint ve Asya filmlerini azaltmak için)
// en: İngilizce, tr: Türkçe, es: İspanyolca, fr: Fransızca, de: Almanca, it: İtalyanca
const ALLOWED_LANGS = 'en|tr|es|fr|de|it'; 

// Parametreye 'shownIds' (Bu oturumda gösterilenler) eklendi
export const fetchSmartMovieData = async (lang, targetGenreId = null, shownIds = []) => {
  const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const regionCode = lang === 'tr' ? 'TR' : 'US';

  try {
    const selectedGenre = targetGenreId 
        ? targetGenreId 
        : HIDDEN_GENRES[Math.floor(Math.random() * HIDDEN_GENRES.length)];

    // Sayfa sayısını biraz artırdık (Daha geniş havuz)
    const randomPage = Math.floor(Math.random() * 50) + 1;

    // API İSTEĞİNE 'with_original_language' EKLENDİ
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre}&page=${randomPage}&language=${apiLang}&sort_by=popularity.desc&with_original_language=${ALLOWED_LANGS}`
    );
    const json = await response.json();
    
    if (!json.results || json.results.length === 0) return null;
    
    // 2. TEKRAR KONTROLÜ (FİLTRELEME)
    // Gelen 20 filmden, daha önce gösterdiklerimizi (shownIds) çıkarıyoruz.
    const availableMovies = json.results.filter(movie => !shownIds.includes(movie.id));

    // Eğer sayfadaki tüm filmleri göstermişsek, mecburen rastgele birini al (Çökmemesi için)
    // Ama genelde availableMovies dolu olacaktır.
    const finalPool = availableMovies.length > 0 ? availableMovies : json.results;

    // Kalan havuzdan rastgele seç
    const movie = finalPool[Math.floor(Math.random() * finalPool.length)];

    // Detayları Çek
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