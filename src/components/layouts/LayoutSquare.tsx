import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { LuWind, LuCloudRain, LuDroplets } from 'react-icons/lu';
import '../../views/Render.css';

export const LayoutSquare: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    // 1:1 Square - "The Cinematic Tile"
    // Header Top, Main Hero Middle, Forecast Bottom (or Metrics)

    const highlightItem = forecastData[0];

    return (
        <div className="render__content" style={{
            ...contentStyle,
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <header className="glass-bento" style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, lineHeight: 1, color: '#fff' }}>
                        {locationName}
                    </h2>
                    <div style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.2rem' }}>
                        {formatDate(currentTime)}
                    </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fff' }}>
                    {formatTime(currentTime)}
                </div>
            </header>

            {/* Hero Card */}
            <div className="glass-bento" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '1rem'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '6rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                        {getIcon(highlightItem.condition)}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {Math.round(highlightItem.tempHigh || highlightItem.temp)}°
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                        {highlightItem.condition}
                    </div>
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="glass-bento" style={{
                flex: '0 0 auto',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LuCloudRain size={24} color="#fff" />
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Precip</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{highlightItem.precip || highlightItem.pop || 0}%</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LuWind size={24} color="#fff" />
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Wind</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{highlightItem.wind}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LuDroplets size={24} color="#fff" />
                    <div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Humidity</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{highlightItem.humidity}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
