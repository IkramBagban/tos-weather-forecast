import { ForecastItem } from '../types';

// Helper: Get Background Image URL from condition text
// Helper: Get Background Image URL from condition text
export const getWeatherBackgroundImage = (condition: string): string | null => {
    if (!condition) return null;
    const c = condition.toLowerCase();

    // Mappings based on user provided files in public/

    // Storms
    if (c.includes('storm') || c.includes('thunder') || c.includes('lightning')) {
        return '/lightning-strike-cloudy-sky-night-time.jpg';
    }

    // Rain
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
        return '/light-moderate-rain.jpg';
    }

    // Snow
    if (c.includes('snow') || c.includes('flurry') || c.includes('frost') || c.includes('ice') || c.includes('blizzard')) {
        return '/snow.jpg';
    }

    // Clouds - Detailed mapping
    if (c.includes('overcast') || c.includes('gloomy')) {
        return '/overcast-cloud.jpg';
    }
    if (c.includes('broken') || c.includes('break')) {
        return '/broken-cloud.jpg';
    }
    if (c.includes('scattered')) {
        return '/scattered-clouds.jpg';
    }
    if (c.includes('few')) {
        return '/few-cloud.jpg';
    }
    // Generic Cloud fallback
    if (c.includes('cloud') || c.includes('grey')) {
        return '/broken-cloud.jpg';
    }

    // Clear / Sunny
    if (c.includes('sunny') || c.includes('fine')) {
        return '/summer-grass-beautiful-day.jpg';
    }
    if (c.includes('clear')) {
        return '/clear-sky.jpg'; // or clearr-sky.jpg
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
import { CloudLightning, CloudRain, Snowflake, CloudFog, Cloud, CloudSun, Sun, Thermometer } from 'lucide-react';
import React from 'react';

// ... (existing imports/code) 

// Helper: Get Icon from condition text
export const getIcon = (condition: string): React.ReactNode => {
    if (!condition) return <Thermometer />;
    const c = condition.toLowerCase();

    // Size is handled by parent container font-size usually, or we can pass props. 
    // Lucide icons use 'width'/'height' or 'size' prop. 
    // Since previous usage was text/emoji (font-size controlled), we should probably ensure these icons inherit size or have a default large size.
    // However, in the layouts, they are often inside a div with font-size set.
    // Lucide icons default to 24px. We might need them to fill the container.
    // Let's assume standard usage for now and user might need to adjust CSS or we pass generic props.
    // Actually, best to return the component with `size="1em"` so it scales with font-size!

    const props = { size: "1em" }; // Scale with font-size

    if (c.includes('storm') || c.includes('thunder')) return <CloudLightning {...props} />;
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain {...props} />;
    if (c.includes('snow') || c.includes('flurry') || c.includes('frost')) return <Snowflake {...props} />;
    if (c.includes('fog') || c.includes('mist')) return <CloudFog {...props} />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud {...props} />;
    if (c.includes('partly')) return <CloudSun {...props} />;
    if (c.includes('clear') || c.includes('sun')) return <Sun {...props} />;
    return <Thermometer {...props} />;
};
