import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import '../../views/Render.css';

// Extreme Vertical Layout (e.g. < 0.45 aspect ratio)
// Strategy: "Vertical Cinematic Ribbon"
// Stack of uniform Glass Bento cards.
// Minimal Data: Day, Icon, Temp (High/Low)

export const LayoutTall: React.FC<WeatherLayoutProps> = ({
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
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '1.5rem 1rem', // Narrow padding
            overflow: 'hidden'
        }}>
            {/* Header: Compact Centered Block */}
            <header className="glass-bento" style={{
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                flexShrink: 0
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    margin: 0,
                    color: '#fff',
                    marginBottom: '0.5rem'
                }}>
                    {locationName}
                </h1>
                <div style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>
                    {formatTime(currentTime)}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.7, marginTop: '0.25rem' }}>
                    {formatDate(currentTime)}
                </div>
            </header>

            {/* Forecast Rail: Vertical Stack of Pills */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                overflow: 'hidden'
            }}>
                {forecastData.slice(0, 5).map((item, i) => (
                    <div key={i} className="glass-bento" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column', // Stack contents vertically
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'rgba(255,255,255,0.05)'
                    }}>
                        {/* Day */}
                        <div style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.8)',
                            marginBottom: '0.5rem'
                        }}>
                            {item.label}
                        </div>

                        {/* Icon */}
                        <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', lineHeight: 1 }}>
                            {getIcon(item.condition)}
                        </div>

                        {/* Temp */}
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
                                {Math.round(item.tempHigh || item.temp)}°
                            </span>
                            {/* Optional Low for Tall View if space permits, usually just High is better for minimal, 
                                but let's include it small if it exists */}
                            {item.tempLow !== undefined && (
                                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                                    {Math.round(item.tempLow)}°
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
