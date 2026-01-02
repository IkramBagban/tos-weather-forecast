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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      let fetchedData: any[] = [];
      let tz: string | null = null;

      const isDaily = ['2d', '3d', '5d', '7d'].includes(forecastRange);
      const daysOrHours = parseInt(forecastRange);

      if (isDaily) {
        // Daily Forecast
        const daily = await weather().getDailyForecast({ ...params, days: daysOrHours });
        fetchedData = daily.slice(0, daysOrHours).map((f: any) => ({
          timestamp: f.Timestamp,
          label: new Date(f.Timestamp * 1000).toLocaleDateString([], { weekday: 'short' }),
          temp: f.MaxTemp, // Compat: keep main temp as max
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

      const current = await weather().getConditions(params);
      tz = current.Timezone;

      setCurrentCondition(current.WeatherText || '');
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
      if (transition === 'none') {
        setCurrentIndex((prev) => (prev + 1) % locations.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % locations.length);
      }
    }, cycleDuration * 1000);
    return () => clearInterval(interval);
  }, [locations, cycleDuration]);

  // Transition Logic
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (transition === 'none') return;
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentIndex, transition]);

  // Fetch when index changes
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

  const currentLoc = locations?.[currentIndex];
  const displayName = currentLoc?.label || currentLoc?.city || (currentLoc?.type === 'auto' ? 'Current Location' : 'Local Weather');

  // Styles
  const glassAlpha = glassOpacity !== undefined ? (glassOpacity / 100).toFixed(2) : '0.65';

  const contentStyle: React.CSSProperties = {
    color: fontColor,
    opacity: transition !== 'none' && !visible ? 0 : 1,
    transform: transition === 'slide' && !visible ? 'translateY(20px)' : 'none',
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
          <button className="render__button" onClick={() => fetchWeather(locations[currentIndex])}>Retry</button>
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
