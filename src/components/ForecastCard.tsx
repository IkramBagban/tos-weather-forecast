import React from 'react';
import { ForecastItem } from '../types';
import '../views/Render.css'; // Sourcing styles

interface ForecastCardProps {
    item: ForecastItem;
    unitLabel: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ item, unitLabel }) => {
    return (
        <div className="forecast-card">
            <div className="forecast-card__header">
                <div className="forecast-card__time">{item.label}</div>
                <div className="weather-icon-3d forecast-card__icon">{item.icon}</div>
            </div>

            <div className="forecast-card__body">
                <div className="forecast-card__temp">{Math.round(item.temp)}°</div>
                <div className="forecast-card__desc">{item.condition}</div>
            </div>

            {/* Secondary Data Strip - Grid */}
            <div className="forecast-card__secondary">
                {item.feelsLike !== undefined && (
                    <div className="secondary-item">
                        <strong>{Math.round(item.feelsLike)}°</strong>
                        <span>Feels Like</span>
                    </div>
                )}
                {item.humidity !== undefined && (
                    <div className="secondary-item">
                        <strong>{Math.round(item.humidity)}%</strong>
                        <span>Humidity</span>
                    </div>
                )}
                {item.wind !== undefined && (
                    <div className="secondary-item">
                        <strong>{Math.round(item.wind)}</strong>
                        <span>Wind</span>
                    </div>
                )}
                {item.precip !== undefined && (
                    <div className="secondary-item">
                        <strong>{Math.round(item.precip)}%</strong>
                        <span>Precip</span>
                    </div>
                )}
            </div>
        </div>
    );
};
