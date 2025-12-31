import React, { useEffect, useState } from 'react';
import { weather } from '@telemetryos/sdk';
import { useUiScaleToSetRem, useUiAspectRatio } from '@telemetryos/sdk/react';
import {
  useLocationsState,
  useCycleDurationState,
  useTransitionState,
  useForecastRangeState,
  useBackgroundTypeState,
  useBackgroundColorState,
  useBackgroundUrlState,
  useBackgroundOpacityState,
  useFontColorState,
  useUnitState,
  useTimeFormatState,
  useDateFormatState,
  useUiScaleStoreState,
  LocationConfig,
} from '../hooks/store';
import './Render.css';

// Helper: Dynamic Background Colors based on condition
// Adapted to take the first forecast item's condition
const getDynamicBackground = (condition: string): string => {
  // Debug log for troubleshooting
  console.log('[DEBUG] getDynamicBackground called with:', condition);

  if (!condition) return 'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)';
  const c = condition.toLowerCase();

  // Sunny / Clear -> Orange/Blue sunny vibes
  if (c.includes('sunny') || c.includes('clear') || c.includes('fine')) return 'linear-gradient(to bottom, #2980B9 0%, #6DD5FA 100%)';
  // or warmer: 'linear-gradient(to bottom, #FFb347 0%, #ffcc33 100%)' but classic weather app is blue sky.
  // Let's try a vibrant Blue Sky.

  // Cloudy -> Greys
  if (c.includes('cloud') || c.includes('overcast') || c.includes('grey') || c.includes('gloomy')) return 'linear-gradient(to bottom, #606c88 0%, #3f4c6b 100%)';

  // Rain / Drizzle -> Darker Blue/Grey
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower') || c.includes('wet')) return 'linear-gradient(to bottom, #3a7bd5 0%, #3a6073 100%)';

  // Snow / Ice -> White/Light Blue
  if (c.includes('snow') || c.includes('ice') || c.includes('hail') || c.includes('frost') || c.includes('flurry')) return 'linear-gradient(to bottom, #E6DADA 0%, #274046 100%)';

  // Night -> Dark
  if (c.includes('night') || c.includes('moon')) return 'linear-gradient(to bottom, #000000 0%, #434343 100%)';

  // Storm -> Purple/Dark
  if (c.includes('storm') || c.includes('thunder') || c.includes('lightning')) return 'linear-gradient(to bottom, #141E30 0%, #243B55 100%)';

  // Fog / Mist -> Hazy
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return 'linear-gradient(to bottom, #757F9A 0%, #D7DDE8 100%)';

  console.log('[DEBUG] No keyword match found for:', c);
  return 'linear-gradient(to bottom, #30cfd0 0%, #330867 100%)'; // Default
};

// Helper: Check if URL is video
const isVideo = (url: string) => {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

// Helper: Get Icon from condition text
const getIcon = (condition: string): string => {
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

interface ForecastItem {
  timestamp: number;
  label: string; // "3 PM" or "Mon"
  temp: number;
  condition: string;
  icon: string;
  humidity?: number;
  wind?: number;
  precip?: number;
  feelsLike?: number;
}

export default function Render() {
  const [__isLoadingScale, uiScale] = useUiScaleStoreState();
  useUiScaleToSetRem(uiScale);

  // Store Hooks
  const [__isLoadingLoc, locations] = useLocationsState();
  const [__isLoadingDur, cycleDuration] = useCycleDurationState();
  const [__isLoadingTrans, transition] = useTransitionState();
  const [__isLoadingRange, forecastRange] = useForecastRangeState();
  const [__isLoadingBgType, bgType] = useBackgroundTypeState();
  const [__isLoadingBgColor, bgColor] = useBackgroundColorState();
  const [__isLoadingBgUrl, bgUrl] = useBackgroundUrlState();
  const [__isLoadingBgOp, bgOpacity] = useBackgroundOpacityState();
  const [__isLoadingFont, fontColor] = useFontColorState();
  const [__isLoadingUnit, unit] = useUnitState();
  const [__isLoadingTime, timeFormat] = useTimeFormatState();
  const [__isLoadingDate, dateFormat] = useDateFormatState();

  const [currentIndex, setCurrentIndex] = useState(0);

  // State for weather data
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For time/date display
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState<string | null>(null);

  const unitLabel = unit === 'imperial' ? '°F' : '°C';

  // Fetch Weather
  const fetchWeather = async (loc: LocationConfig) => {
    setLoading(true);
    setError(null);
    try {
      const units = unit === 'imperial' ? 'imperial' : 'metric';
      let params: any = { units };

      if (loc.type === 'manual' && loc.city) {
        params.city = loc.city;
      }
      // If auto (loc.type === 'auto'), we purposefully omit 'city', 'lat', 'lon'.
      // The SDK's @telemetryos/sdk weather() implementation automatically detects device location 
      // when no location parameters are provided.

      let fetchedData: any[] = [];
      let tz = '';

      // Determine type of forecast
      const isDaily = ['2d', '3d', '5d', '7d'].includes(forecastRange);
      const daysOrHours = parseInt(forecastRange); // '3d' -> 3, '24h' -> 24

      if (isDaily) {
        // Daily Forecast
        const daily = await weather().getDailyForecast({ ...params, days: daysOrHours });
        fetchedData = daily.slice(0, daysOrHours).map((f: any) => ({
          timestamp: f.Timestamp,
          label: new Date(f.Timestamp * 1000).toLocaleDateString([], { weekday: 'short' }),
          temp: f.MaxTemp, // Using Max Temp for daily view
          condition: f.Label,
          icon: getIcon(f.Label),
          // Extract secondary daily data if available
          humidity: f.RelativeHumidity?.Average || f.RelativeHumidity, // API variance handling
          wind: f.WindSpeed?.Average || f.WindSpeed?.Value || f.WindSpeed,
          precip: f.PrecipitationProbability || f.Precip,
          // 'RealFeel' might be buried in 'RealFeelTemperature' object
          feelsLike: f.RealFeelTemperature?.Maximum?.Value || f.RealFeelTemperature?.Value,
        }));
      } else {
        // Hourly Forecast
        const hours = daysOrHours;
        const hourly = await weather().getHourlyForecast({ ...params, hours });
        fetchedData = hourly.slice(0, hours).map((f: any) => ({
          timestamp: f.Timestamp,
          label: new Date(f.Timestamp * 1000).toLocaleTimeString([], { hour: 'numeric' }),
          temp: f.Temp,
          condition: f.Label,
          icon: getIcon(f.Label),
          humidity: f.RelativeHumidity,
          wind: f.WindSpeed?.Value || f.WindSpeed,
          precip: f.PrecipitationProbability,
          feelsLike: f.RealFeelTemperature?.Value || f.RealFeelTemperature
        }));
      }

      // Fetch 'Current' to get Timezone and accurate location name for "Auto"
      // This is a minimal extra call to ensure quality metadata
      const current = await weather().getConditions(params);
      tz = current.Timezone;

      setTimezone(tz);
      setForecastData(fetchedData);

    } catch (err) {
      console.error('Weather Fetch Error:', err);
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycling
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const interval = setInterval(() => {
      // Logic for transition handled by CSS class toggling in a real app, 
      // here we just swap index for simplicity or use the 'visible' state trick

      if (transition === 'none') {
        setCurrentIndex((prev) => (prev + 1) % locations.length);
      } else {
        // Simple fade out/in logic could be added here
        // For MVP/Proto, just switching
        setCurrentIndex((prev) => (prev + 1) % locations.length);
      }
    }, cycleDuration * 1000);
    return () => clearInterval(interval);
  }, [locations, cycleDuration]);

  // Transition Logic wrapper (simplified)
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (transition === 'none') return;
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex, transition]);


  // Helper Effect to fetch when index changes
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const loc = locations[currentIndex] || locations[0];
    fetchWeather(loc);
  }, [currentIndex, locations, forecastRange, unit]);


  // Formatting
  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: timeFormat === '12h',
        timeZone: timezone || undefined,
      });
    } catch {
      return date.toLocaleTimeString();
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone || undefined
    };
    if (dateFormat === 'MMM DD, YYYY') { options.month = 'short'; options.day = '2-digit'; options.year = 'numeric'; }
    else if (dateFormat === 'YYYY-MM-DD') {
      return date.toLocaleDateString('en-CA', { ...options, year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    else return date.toLocaleDateString('en-US', options);

    return date.toLocaleDateString('en-US', options);
  };

  // Rendering Layout Determination
  const aspectRatio = useUiAspectRatio();
  // > 1 is Landscape, < 1 is Portrait. 
  // Extreme Landscape > 3. Extreme Portrait < 0.3?

  const isLandscape = aspectRatio > 1.2;
  const isExtreme = aspectRatio > 3 || aspectRatio < 0.35;

  const currentLoc = locations?.[currentIndex];
  // Ideally, if we had the 'current' weather response stored, we could use its CityEnglish.
  // We're using local state timezone but not city name. 
  // Let's rely on label or generic.
  const displayName = currentLoc?.label || currentLoc?.city || (currentLoc?.type === 'auto' ? 'Current Location' : 'Local Weather');

  // Styles
  const opacityValue = (bgOpacity ?? 100) / 100;

  const renderBackground = () => {
    const commonStyle: React.CSSProperties = {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      zIndex: -1, opacity: opacityValue, transition: 'all 0.5s ease',
    };

    if (bgType === 'image' && bgUrl) {
      if (isVideo(bgUrl)) {
        return <video src={bgUrl} autoPlay loop muted playsInline style={{ ...commonStyle, objectFit: 'cover' }} />;
      }
      return <div style={{ ...commonStyle, backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />;
    }
    if (bgType === 'solid') {
      return <div style={{ ...commonStyle, backgroundColor: bgColor }} />;
    }
    // Dynamic based on FIRST forecast item
    const firstCond = forecastData?.[0]?.condition || '';
    return <div style={{ ...commonStyle, background: getDynamicBackground(firstCond) }} />;
  };

  const contentStyle: React.CSSProperties = {
    color: fontColor,
    opacity: transition !== 'none' && !visible ? 0 : 1,
    transform: transition === 'slide' && !visible ? 'translateX(-20px)' : 'none',
  };

  // Decide layout class
  const containerClass = isLandscape ? 'forecast-container--row' : 'forecast-container--col';

  // --- EDGE CASES ---

  // Empty State
  if (!locations || locations.length === 0) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor, fontSize: '2rem' }}>
        <div className="render__message">
          <h1>No Locations Configured</h1>
          <p>Please open Settings to add a location.</p>
        </div>
        {renderBackground()}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor }}>
        <div className="render__message">
          <h1>⚠️ Weather Unavailable</h1>
          <p>{error}</p>
          <button onClick={() => fetchWeather(locations[currentIndex])} style={{
            marginTop: '1rem', padding: '0.5rem 1rem', fontSize: '1.5rem',
            cursor: 'pointer', borderRadius: '0.5rem', border: 'none', background: 'rgba(255,255,255,0.3)'
          }}>
            Retry
          </button>
        </div>
        {renderBackground()}
      </div>
    );
  }

  // Loading State (Initial)
  if (loading && forecastData.length === 0) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor, fontSize: '2rem' }}>
        <div>Loading Forecast...</div>
        {renderBackground()}
      </div>
    );
  }

  return (
    <div className={`render ${isExtreme ? 'render--extreme' : ''}`}>
      {renderBackground()}

      <div className="render__content" style={contentStyle}>

        {/* Header: Location & Time */}
        <header className="render__header">
          <div className="render__location">{displayName}</div>
          <div className="render__clock">
            <div className="render__time">{formatTime(currentTime)}</div>
            <div className="render__date">{formatDate(currentTime)}</div>
          </div>
        </header>

        {/* Forecast Grid */}
        <div className={`forecast-container ${containerClass}`}>
          {forecastData.map((item, i) => (
            <div key={i} className="forecast-card">
              <div className="forecast-card__time">{item.label}</div>
              <div className="weather-icon-3d forecast-card__icon">{item.icon}</div>
              <div className="forecast-card__temp">{Math.round(item.temp)}{unitLabel}</div>
              <div className="forecast-card__desc">{item.condition}</div>

              {/* Secondary Data Strip - Compact */}
              <div className="forecast-card__secondary">
                {item.feelsLike !== undefined && <span title="Feels Like">🌡️ {Math.round(item.feelsLike)}°</span>}
                {item.humidity !== undefined && <span title="Humidity">💧 {Math.round(item.humidity)}%</span>}
                {item.wind !== undefined && <span title="Wind Speed">💨 {Math.round(item.wind)}</span>}
                {item.precip !== undefined && <span title="Precipitation">🌧️ {Math.round(item.precip)}%</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
