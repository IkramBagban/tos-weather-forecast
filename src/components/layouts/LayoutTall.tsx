import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { ForecastCard } from '../ForecastCard';
import '../../views/Render.css';

export const LayoutTall: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    unitLabel,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    return (
        <div className="render__content" style={contentStyle}>
            <header className="render__header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="render__location" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {locationName}
                </div>
                <div className="header-right">
                    {formatTime(currentTime)}<br />
                    {formatDate(currentTime)}
                </div>
            </header>

            <div className="forecast-columns" style={{ flexDirection: 'column', height: 'auto', flex: 1, overflowY: 'hidden' }}>
                {forecastData.map((item, i) => (
                    <ForecastCard
                        key={i}
                        item={item}
                        unitLabel={unitLabel}
                        isHighlight={i === 0}
                    />
                ))}
            </div>
        </div>
    );
};
