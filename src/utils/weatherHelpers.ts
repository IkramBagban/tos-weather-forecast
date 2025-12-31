import { ForecastItem } from '../types';

// Helper: Get Background Image URL from condition text
export const getWeatherBackgroundImage = (condition: string): string | null => {
    if (!condition) return null;
    const c = condition.toLowerCase();

    // Mappings based on user provided files
    // public/clear-sky-h.jpg
    // public/few-clouds-h.jpg
    // public/rain-h.jpg
    // public/thunderstorm-night-h.jpg

    if (c.includes('storm') || c.includes('thunder') || c.includes('lightning')) {
        return '/thunderstorm-night-h.jpg';
    }

    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
        return '/rain-h.jpg';
    }

    if (c.includes('cloud') || c.includes('overcast') || c.includes('gloomy') || c.includes('grey')) {
        return '/few-clouds-h.jpg'; // Using 'few-clouds' as generic cloud placeholder for now per user request
    }

    if (c.includes('sunny') || c.includes('clear') || c.includes('fine')) {
        return '/clear-sky-h.jpg';
    }

    return null;
};


// Helper logic: Priority-based background
// We prioritise Current Conditions (what is happening now), then fallback to Forecast
export const getDynamicBackground = (currentCondition: string, forecastItems: ForecastItem[]): string => {
    // Debug log for troubleshooting
    // console.log('[DEBUG] Background Trig. Current:', currentCondition);

    let targetCondition = currentCondition;

    if (!targetCondition && forecastItems && forecastItems.length > 0) {
        // Fallback: look at first forecast item
        targetCondition = forecastItems[0].condition;
        // console.log('[DEBUG] Fallback to forecast:', targetCondition);
    }

    if (!targetCondition) return 'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)';

    const c = targetCondition.toLowerCase();

    // Sunny / Clear -> Orange/Blue sunny vibes
    if (c.includes('sunny') || c.includes('clear') || c.includes('fine')) return 'linear-gradient(to bottom, #2980B9 0%, #6DD5FA 100%)';

    // Storm -> Purple/Dark
    if (c.includes('storm') || c.includes('thunder') || c.includes('lightning')) return 'linear-gradient(to bottom, #141E30 0%, #243B55 100%)';

    // Snow / Ice -> White/Light Blue
    if (c.includes('snow') || c.includes('ice') || c.includes('hail') || c.includes('blizzard') || c.includes('frost') || c.includes('flurry')) return 'linear-gradient(to bottom, #E6DADA 0%, #274046 100%)';

    // Rain / Drizzle -> Darker Blue/Grey
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower') || c.includes('wet')) return 'linear-gradient(to bottom, #3a7bd5 0%, #3a6073 100%)';

    // Fog / Mist -> Hazy
    if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'linear-gradient(to bottom, #757F9A 0%, #D7DDE8 100%)';

    // Cloudy -> Greys
    if (c.includes('cloud') || c.includes('overcast') || c.includes('grey') || c.includes('gloomy')) return 'linear-gradient(to bottom, #606c88 0%, #3f4c6b 100%)';

    // Night -> Dark
    if (c.includes('night') || c.includes('moon')) return 'linear-gradient(to bottom, #000000 0%, #434343 100%)';

    // console.log('[DEBUG] No keyword match found for:', c);
    return 'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)'; // Default
};

// Helper: Check if URL is video
export const isVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

// Helper: Get Icon from condition text
export const getIcon = (condition: string): string => {
    if (!condition) return '❓';
    const c = condition.toLowerCase();
    if (c.includes('storm') || c.includes('thunder')) return '⛈️';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
    if (c.includes('snow') || c.includes('flurry') || c.includes('frost')) return '❄️';
    if (c.includes('fog') || c.includes('mist')) return '🌫️';
    if (c.includes('cloud') || c.includes('overcast')) return '☁️';
    if (c.includes('partly')) return '⛅';
    if (c.includes('clear') || c.includes('sun')) return '☀️';
    return '🌡️';
};
