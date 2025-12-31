import React, { useEffect, useState, useMemo } from 'react';
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
import { weather } from '@telemetryos/sdk';
import { useUiScaleToSetRem, useUiAspectRatio } from '@telemetryos/sdk/react';
import './Render.css';

// Modular Imports
import { ForecastItem } from '../types';
import { getIcon } from '../utils/weatherHelpers';
import { ForecastCard } from '../components/ForecastCard';
import { WeatherBackground } from '../components/WeatherBackground';

// Start Render Component
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
  const [currentCondition, setCurrentCondition] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState<string | null>(null);

  const unitLabel = unit === 'imperial' ? '°F' : '°C';

  // Fetch Weather
  const fetchWeather = async (loc: LocationConfig) => {
    // Keep loading true only on first load or manual retry, to avoid flashing on cycle?
    // Actually for cycle we want smooth transition.
    // Let's set loading but usually we might want to pre-fetch.
    // For this MVP structure, we just fetch.
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
      let tz: string | null = null; // Fix type inference

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

      // Update State
      setCurrentCondition(current.WeatherText || ''); // Capture current condition
      setTimezone(tz || null);
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
    }, 600); // Matched CSS transition time
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
  const contentStyle: React.CSSProperties = {
    color: fontColor,
    opacity: transition !== 'none' && !visible ? 0 : 1,
    transform: transition === 'slide' && !visible ? 'translateY(20px)' : 'none', // Changed to Y axis for better modern feel? Or X. Let's stick to X or Y.
  };

  // Decide layout class
  const containerClass = isLandscape ? 'forecast-container--row' : 'forecast-container--col';

  // --- RENDERING ---

  const backgroundLayer = (
    <WeatherBackground
      bgType={bgType}
      bgColor={bgColor}
      bgUrl={bgUrl}
      bgOpacity={bgOpacity}
      currentCondition={currentCondition}
      forecastData={forecastData}
    />
  );

  // Empty State
  if (!locations || locations.length === 0) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor }}>
        <div className="render__message">
          <h1>No Locations Configured</h1>
          <p>Please open Settings to add a location.</p>
        </div>
        {backgroundLayer}
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
          <button className="render__button" onClick={() => fetchWeather(locations[currentIndex])}>
            Retry Connection
          </button>
        </div>
        {backgroundLayer}
      </div>
    );
  }

  // Loading State (Initial)
  if (loading && forecastData.length === 0) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor }}>
        <div className="render__message">
          <h1>Loading Forecast...</h1>
        </div>
        {backgroundLayer}
      </div>
    );
  }

  return (
    <div className={`render ${isExtreme ? 'render--extreme' : ''}`}>
      {backgroundLayer}

      <div className="render__content" style={contentStyle}>

        {/* Header */}
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
            <ForecastCard key={i} item={item} unitLabel={unitLabel} />
          ))}
        </div>

      </div>
    </div>
  );
}
