import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import '../../views/Render.css';

// Extreme Vertical Ribbons (e.g. 5:1 Aspect Ratio)
// Strategy: "Tight Glass Pills"
// Drop Tier 2 (Condition Text) and Tier 3 (Metrics) completely.
// Only show: Day Name, Icon, Temp (Center)

export const LayoutWide: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    return (
        <div className="render__content" style={{
            ...contentStyle,
            flexDirection: 'row',
            alignItems: 'center',
            padding: '1rem 2rem', // Reduced padding for ribbon
            gap: '2rem'
        }}>
            {/* Header: Compact Ribbon Block */}
            <header className="glass-bento" style={{
                flex: '0 0 20%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 2rem',
                height: '100%'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, lineHeight: 1, color: '#fff' }}>
                        {locationName}
                    </h1>
                    <div style={{ fontSize: '1.2rem', opacity: 0.7, marginTop: '0.2rem' }}>
                        {formatDate(currentTime)}
                    </div>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff' }}>
                    {formatTime(currentTime)}
                </div>
            </header>

            {/* Forecast Rail: Tight Pills */}
            <div style={{
                flex: 1,
                display: 'flex',
                gap: '1rem',
                height: '100%',
                alignItems: 'stretch'
            }}>
                {forecastData.map((item, i) => (
                    <div key={i} className="glass-bento" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column', // Stack vertically for tight pill
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.05)' // Slightly more transparent
                    }}>
                        {/* Day */}
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                            {item.label}
                        </div>

                        {/* Icon */}
                        <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>
                            {getIcon(item.condition)}
                        </div>

                        {/* Temp */}
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                            {Math.round(item.tempHigh || item.temp)}°
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
