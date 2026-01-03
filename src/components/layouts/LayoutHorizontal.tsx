import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { Wind, Droplets, Thermometer, CloudRain } from 'lucide-react';
import '../../views/Render.css';

export const LayoutHorizontal: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    return (
        <div className="render__content" style={contentStyle}>
            {/* Header: Location + Date/Time */}
            <header className="render__header glass-panel" style={{ padding: '2rem 1.5rem', minHeight: '15vmin' }}>
                <div className="render__location">
                    {locationName}
                </div>
                <div className="header-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <div className="time-display">{formatTime(currentTime)}</div>
                    <div className="date-display">{formatDate(currentTime)}</div>
                </div>
            </header>

            {/* Forecast Columns */}
            <div className="forecast-columns glass-panel">
                {forecastData.map((item, i) => (
                    <div key={i} className={`forecast-col ${i === 0 ? 'forecast-col--highlight' : ''}`}>
                        {/* Day Label */}
                        <div className="col-header">{item.label}</div>

                        {/* Weather Icon */}
                        <div className="col-icon">
                            {getIcon(item.condition)}
                        </div>

                        {/* Condition Text */}
                        <div className="col-condition">
                            {item.condition}
                        </div>

                        {/* Temperature: High / Low */}
                        <div className="col-temps">
                            <div className="temp-high">{Math.round(item.tempHigh || item.temp)}°</div>
                            {item.tempLow !== undefined && (
                                <div className="temp-low">{Math.round(item.tempLow)}°</div>
                            )}
                        </div>

                        {/* Secondary Data with Icons (PRD Requirement) */}
                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            width: '100%',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {/* Feels Like */}
                            {item.feelsLike && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5vmin', color: 'var(--text-secondary)' }}>
                                    <Thermometer size={14} color="var(--accent-sun)" />
                                    <span>{Math.round(item.feelsLike)}°</span>
                                </div>
                            )}
                            {/* Humidity */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5vmin', color: 'var(--text-secondary)' }}>
                                <Droplets size={14} color="var(--accent-rain)" />
                                <span>{item.humidity || 0}%</span>
                            </div>
                            {/* Wind */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5vmin', color: 'var(--text-secondary)' }}>
                                <Wind size={14} color="var(--accent-cloud)" />
                                <span>{item.wind || 0}</span>
                            </div>
                            {/* Precipitation Chance */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5vmin', color: 'var(--text-secondary)' }}>
                                <CloudRain size={14} color="var(--accent-rain)" />
                                <span>{item.precip || item.pop || 0}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
