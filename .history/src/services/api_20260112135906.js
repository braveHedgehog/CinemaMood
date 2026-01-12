// src/services/api.js

const TMDB_API_KEY = '6d0eb9fb2cc59746f4d2de2ecf59d9c9'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
export const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

const ALLOWED_LANGS = 'en|tr|es|fr|de|it'; 

export const fetchSmartMovieData = async (lang, targetGenreId = null, shownIds = []) => {
  const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const regionCode = lang === 'tr' ? 'TR' : 'US';
  const today = new Date().toISOString().split('T')[0]; 
  const minDate = '1960-01-01';

  try {
    let randomPage = Math.floor(Math.random() * 30) + 1;
    let url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&language=${apiLang}`;

    // --- FİLTRELER ---
    url += `&primary_release_date.gte=${minDate}&primary_release_date.lte=${today}`;

    if (targetGenreId === 'local-tr') {
        url += `&vote_count.gte=10`; 
    } else {
        url += `&vote_count.gte=150`; 
        url += `&vote_average.gte=5.0`; 
    }

    // --- KATEGORİ MANTIĞI ---
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
    
    // --- 1. AŞAMA: TEMEL FİLTRELEME (LİSTE BAZLI) ---
    // Posteri olmayan, Konusu (Overview) boş olan veya daha önce gösterilenleri direk ele.
    let candidatePool = json.results.filter(m => 
        m.poster_path !== null && 
        m.overview && 
        m.overview.trim() !== "" && 
        !shownIds.includes(m.id)
    );

    // Eğer havuz boşaldıysa null dön (App.js hata mesajı verir veya tekrar dener)
    if (candidatePool.length === 0) return null;

    // --- 2. AŞAMA: DETAYLI KONTROL DÖNGÜSÜ ---
    // Rastgele bir film seçip detaylarına bakacağız.
    // Eğer oyuncusu yoksa, havuzdan atıp yenisini seçeceğiz.
    
    while (candidatePool.length > 0) {
        // Havuzdan rastgele bir index seç
        const randomIndex = Math.floor(Math.random() * candidatePool.length);
        const movie = candidatePool[randomIndex];

        // Detayları (Credits) çek
        const creditsRes = await fetch(`${BASE_URL}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=${apiLang}`);
        const creditsJson = await creditsRes.json();

        // --- KRİTİK KONTROL: OYUNCU VAR MI? ---
        const hasCast = creditsJson.cast && creditsJson.cast.length > 0;

        if (hasCast) {
            // ✅ FİLM GEÇERLİ! Diğer detayları da çek ve döndür.
            
            // Video Çek
            const videosRes = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=${apiLang}`);
            let videosJson = await videosRes.json();
            if (!videosJson.results || videosJson.results.length === 0) {
                const enVideosRes = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
                videosJson = await enVideosRes.json();
            }

            // Platform Çek
            const providerRes = await fetch(`${BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`);
            const providerJson = await providerRes.json();
            const localProviders = providerJson.results?.[regionCode];

            return { movie, credits: creditsJson, providers: localProviders, videos: videosJson };
        
        } else {
            // ❌ FİLM GEÇERSİZ (Oyuncusu yok).
            // Bu filmi havuzdan sil ve döngüye devam et (Bir sonrakini dene).
            candidatePool.splice(randomIndex, 1);
        }
    }

    // Eğer döngü bitti ve hiç geçerli film bulunamadıysa:
    return null;

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};