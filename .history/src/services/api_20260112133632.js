// src/services/api.js

const TMDB_API_KEY = '6d0eb9fb2cc59746f4d2de2ecf59d9c9'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

// Avrupa ve TR dilleri (Standart arama için)
const ALLOWED_LANGS = 'en|tr|es|fr|de|it'; 

export const fetchSmartMovieData = async (lang, targetGenreId = null, shownIds = []) => {
  const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const regionCode = lang === 'tr' ? 'TR' : 'US';

  try {
    // Rastgele sayfa (Yerli filmler için havuz daha dar olabilir, o yüzden 50 değil 10 yapıyoruz garanti olsun)
    let randomPage = Math.floor(Math.random() * 50) + 1;
    
    // API URL'sini dinamik oluşturacağız
    let url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&language=${apiLang}`;

    // --- ÖZEL KATEGORİ MANTIĞI ---
    if (targetGenreId === 'local-tr') {
        // DURUM 1: YERLİ FİLMLER
        // Sadece Türkçe (tr) filmleri getir. Tür kısıtlaması yok.
        // Sayfa sayısını düşürüyoruz çünkü yerli film sayısı global kadar çok değil.
        randomPage = Math.floor(Math.random() * 10) + 1; 
        url += `&with_original_language=tr&page=${randomPage}`;
    
    } else if (targetGenreId === 'rom-com') {
        // DURUM 2: ROMANTİK KOMEDİ
        // Hem Romantik(10749) HEM DE Komedi(35) olanları getir (AND mantığı için virgül kullanılır)
        url += `&with_genres=10749,35&with_original_language=${ALLOWED_LANGS}&page=${randomPage}`;

    } else {
        // DURUM 3: STANDART (Tek Tür veya Rastgele)
        const selectedGenre = targetGenreId 
            ? targetGenreId 
            : HIDDEN_GENRES[Math.floor(Math.random() * HIDDEN_GENRES.length)];
        
        url += `&with_genres=${selectedGenre}&with_original_language=${ALLOWED_LANGS}&page=${randomPage}`;
    }

    // İSTEĞİ AT
    const response = await fetch(url);
    const json = await response.json();
    
    if (!json.results || json.results.length === 0) return null;
    
    // TEKRAR KONTROLÜ
    const availableMovies = json.results.filter(movie => !shownIds.includes(movie.id));
    const finalPool = availableMovies.length > 0 ? availableMovies : json.results;

    // SEÇİM YAP
    const movie = finalPool[Math.floor(Math.random() * finalPool.length)];

    // DETAYLARI ÇEK
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