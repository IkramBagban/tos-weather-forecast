import React, { useEffect, useState } from 'react';
import {
  useLocationsState,
  useCycleDurationState,
  useTransitionState,
  useForecastRangeState,
  useBackgroundTypeState,
  useBackgroundColorState,
  useBackgroundUrlState,
  useBackgroundOpacityState,
  useGlassOpacityState,
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
import { ForecastItem, WeatherLayoutProps } from '../types';
import { getIcon } from '../utils/weatherHelpers';
import { WeatherBackground } from '../components/WeatherBackground';

// Layout Components
import { LayoutHorizontal } from '../components/layouts/LayoutHorizontal';
import { LayoutVertical } from '../components/layouts/LayoutVertical';
import { LayoutWide } from '../components/layouts/LayoutWide';
import { LayoutTall } from '../components/layouts/LayoutTall';
import { LayoutSquare } from '../components/layouts/LayoutSquare';

// Start Render Component
export default function Render() {
  const [__isLoadingScale, uiScale] = useUiScaleStoreState();
  useUiScaleToSetRem(uiScale);

  // Store Hooks
  const [__isLoadingLoc, locations] = useLocationsState();
  useEffect(() => {
    console.log('[DEBUG] All Configured Locations:', locations);
  }, [locations]);
  const [__isLoadingDur, cycleDuration] = useCycleDurationState();
  const [__isLoadingTrans, transition] = useTransitionState();
  const [__isLoadingRange, forecastRange] = useForecastRangeState();
  const [__isLoadingBgType, bgType] = useBackgroundTypeState();
  const [__isLoadingBgColor, bgColor] = useBackgroundColorState();
  const [__isLoadingBgUrl, bgUrl] = useBackgroundUrlState();
  const [__isLoadingBgOp, bgOpacity] = useBackgroundOpacityState();
  const [__isLoadingGlassOp, glassOpacity] = useGlassOpacityState();
  const [__isLoadingFont, fontColor] = useFontColorState();
  const [__isLoadingUnit, unit] = useUnitState();
  const [__isLoadingTime, timeFormat] = useTimeFormatState();
  const [__isLoadingDate, dateFormat] = useDateFormatState();

  const [currentIndex, setCurrentIndex] = useState(0);

  // State for weather data
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [currentCondition, setCurrentCondition] = useState<string>('');
  const [detectedCity, setDetectedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezone, setTimezone] = useState<string | null>(null);

  const unitLabel = unit === 'imperial' ? '°F' : '°C';

  // Fetch Weather Helper (Returns Data w/o Setting State)
  const getWeatherData = async (loc: LocationConfig) => {
    try {
      const units = unit === 'imperial' ? 'imperial' : 'metric';
      let params: any = { units };
      let fetchedData: any[] = [];

      // Auto Location Handling (Device Geolocation)
      if (loc.type === 'auto') {
        // Rely on SDK IP fallback
      } else if (loc.type === 'manual' && loc.city) {
        params.city = loc.city;
      }

      const isDaily = ['2d', '3d', '5d', '7d'].includes(forecastRange);
      const daysOrHours = parseInt(forecastRange);

      if (isDaily) {
        const daily = await weather().getDailyForecast({ ...params, days: daysOrHours });
        fetchedData = daily.slice(0, daysOrHours).map((f: any) => ({
          timestamp: f.Timestamp,
          label: new Date(f.Timestamp * 1000).toLocaleDateString([], { weekday: 'short' }),
          temp: f.MaxTemp,
          tempHigh: f.MaxTemp,
          tempLow: f.MinTemp,
          condition: f.Label,
          icon: getIcon(f.Label),
          humidity: f.RelativeHumidity?.Average || f.RelativeHumidity,
          wind: f.WindSpeed?.Average || f.WindSpeed?.Value || f.WindSpeed,
          precip: f.PrecipitationProbability || f.Precip,
          feelsLike: f.RealFeelTemperature?.Maximum?.Value || f.RealFeelTemperature?.Value,
        }));
      } else {
        const hourly = await weather().getHourlyForecast({ ...params, hours: daysOrHours });
        fetchedData = hourly.slice(0, daysOrHours).map((f: any) => ({
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

      const current = await weather().getConditions(params);

      // Debug Logs using the same structure as before
      console.log('[DEBUG] Weather Fetch for Location:', loc);
      console.log('[DEBUG] Fetched Forecast Data:', fetchedData);
      console.log('[DEBUG] Current Conditions (API):', current);

      return {
        forecastData: fetchedData,
        currentCondition: current.WeatherText || '',
        detectedCity: current.CityLocalized || current.CityEnglish || '',
        timezone: current.Timezone
      };

    } catch (err) {
      console.error('Weather Fetch Error:', err);
      return null;
    }
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Transition Logic
  const [visible, setVisible] = useState(true);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Main Cycle Loop
  useEffect(() => {
    if (!locations || locations.length === 0) return;

    const cycle = async () => {
      const nextIndex = (currentIndex + 1) % locations.length;

      // 1. Fade Out
      if (transition !== 'instant') {
        setVisible(false);
      }

      // 2. Pre-Fetch Next Data + Wait for Animation
      // Minimum wait time matches transition duration (e.g., 600ms)
      const [data] = await Promise.all([
        getWeatherData(locations[nextIndex]),
        transition !== 'instant' ? new Promise(resolve => setTimeout(resolve, 600)) : Promise.resolve()
      ]);

      if (data) {
        // 3. Update State (Cut to new scene)
        setForecastData(data.forecastData);
        setCurrentCondition(data.currentCondition);
        setDetectedCity(data.detectedCity);
        setTimezone(data.timezone);
        setCurrentIndex(nextIndex);
        setError(null);
      } else {
        // Keep old data but maybe show error toast? For now just log.
        console.warn('Failed to load next location data');
      }

      // 4. Fade In
      if (transition !== 'instant') {
        setVisible(true);
      }
    };

    // Schedule next cycle
    timerRef.current = setTimeout(cycle, cycleDuration * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, locations, cycleDuration, transition, forecastRange, unit]);

  // Initial Load (One-time)
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    // If we have no data yet, fetch immediately for index 0
    if (forecastData.length === 0 && !loading) {
      setLoading(true);
      getWeatherData(locations[0]).then(data => {
        if (data) {
          setForecastData(data.forecastData);
          setCurrentCondition(data.currentCondition);
          setDetectedCity(data.detectedCity);
          setTimezone(data.timezone);
          setCurrentIndex(0);
        } else {
          setError('Unable to load initial weather data');
        }
        setLoading(false);
      });
    }
  }, [locations]); // Only on locations load

  // Config Change Refresh (Unit/Range changes shouldn't cycle, just refresh current)
  useEffect(() => {
    if (!locations || locations.length === 0) return;
    const refresh = async () => {
      setLoading(true);
      const data = await getWeatherData(locations[currentIndex]);
      if (data) {
        setForecastData(data.forecastData);
        setCurrentCondition(data.currentCondition);
        setDetectedCity(data.detectedCity);
        setTimezone(data.timezone);
      }
      setLoading(false);
    };
    refresh();
  }, [unit, forecastRange]);


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
    else if (dateFormat === 'DD/MM/YYYY') {
      return date.toLocaleDateString('en-GB', { ...options, year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    else {
      // Default / MM/DD/YYYY
      return date.toLocaleDateString('en-US', { ...options, year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    return date.toLocaleDateString('en-US', options);
  };

  // Rendering Layout Determination
  const aspectRatio = useUiAspectRatio();

  const currentLoc = locations?.[currentIndex];
  // Priority: Override Label > API Detected Name > Manual Config Name > Fallback
  const displayName = currentLoc?.label || detectedCity || currentLoc?.city || '';

  // Styles
  const glassAlpha = glassOpacity !== undefined ? (glassOpacity / 100).toFixed(2) : '0.65';

  const contentStyle: React.CSSProperties = {
    color: fontColor,
    opacity: transition !== 'instant' && !visible ? 0 : 1,
    transform: transition === 'slide' && !visible ? 'translateY(20px)' : 'none',
    transition: transition === 'instant' ? 'none' : 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
    ['--glass-bg' as any]: `rgba(20, 20, 20, ${glassAlpha})`,
  };

  // Layout Component Switcher
  let LayoutComponent = LayoutHorizontal; // Default (16:9 Landscape)

  if (aspectRatio > 2.2) {
    LayoutComponent = LayoutWide;
  } else if (aspectRatio > 1.2 && aspectRatio <= 2.2) {
    LayoutComponent = LayoutHorizontal; // Standard Landscape
  } else if (aspectRatio >= 0.8 && aspectRatio <= 1.2) {
    LayoutComponent = LayoutSquare;
  } else if (aspectRatio >= 0.45 && aspectRatio < 0.8) {
    LayoutComponent = LayoutVertical; // Portrait
  } else {
    LayoutComponent = LayoutTall; // Extreme Portrait
  }

  // Prepare props
  const layoutProps: WeatherLayoutProps = {
    forecastData,
    currentCondition,
    locationName: displayName,
    unitLabel,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
  };

  // --- RENDERING ---

  const backgroundLayer = (
    <div className="weather-bg-layer">
      <WeatherBackground
        bgType={bgType}
        bgColor={bgColor} // Fallback
        bgUrl={bgUrl}
        bgOpacity={bgOpacity} // Now controlled by slider
        currentCondition={currentCondition}
        forecastData={forecastData}
      />
    </div>
  );

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

  if (error) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor }}>
        <div className="render__message">
          <h1>⚠️ Weather Unavailable</h1>
          <p>{error}</p>
          <button className="render__button" onClick={() => {
            setLoading(true);
            getWeatherData(locations[currentIndex]).then(data => {
              if (data) {
                setForecastData(data.forecastData);
                setCurrentCondition(data.currentCondition);
                setDetectedCity(data.detectedCity);
                setTimezone(data.timezone);
                setError(null);
              } else {
                setError('Retry failed');
              }
              setLoading(false);
            });
          }}>Retry</button>
        </div>
        {backgroundLayer}
      </div>
    );
  }

  if (loading && forecastData.length === 0) {
    return (
      <div className="render" style={{ justifyContent: 'center', alignItems: 'center', color: fontColor }}>
        <h1>Loading...</h1>
        {backgroundLayer}
      </div>
    );
  }

  return (
    <div className={`render`}>
      {backgroundLayer}
      <LayoutComponent {...layoutProps} />
    </div>
  );
}
