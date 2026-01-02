import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { LuWind, LuCloudRain } from 'react-icons/lu';
import '../../views/Render.css';

export const LayoutVertical: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    // 9:16 / 4:3 "Vertical Stack" Layout
    // Header Glass Card at Top
    // Stack of Wide Horizontal Glass Cards

    return (
        <div className="render__content" style={{
            ...contentStyle,
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '2rem',
            overflow: 'hidden'
        }}>
            {/* 1. Header Glass Card (Top) */}
            <header className="glass-bento" style={{
                padding: '2rem 2.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <div>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: 700,
                        lineHeight: 1,
                        margin: 0,
                        color: '#fff',
                        letterSpacing: '-0.02em'
                    }}>
                        {locationName}
                    </h1>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '0.5rem'
                    }}>
                        {formatDate(currentTime)}
                    </div>
                </div>
                {/* Time centered vertically on right */}
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1
                }}>
                    {formatTime(currentTime)}
                </div>
            </header>

            {/* 2. Vertical Stack of Wide Cards */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                overflowY: 'hidden' // Or auto if scrolling needed, but usually fixed for signage
            }}>
                {forecastData.slice(0, 6).map((item, i) => (
                    <div key={i} className="glass-bento" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 2.5rem',
                        gap: '2rem'
                    }}>
                        {/* Left: Day Name */}
                        <div style={{ flex: '0 0 15%', textAlign: 'left' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#fff',
                                letterSpacing: '0.05em'
                            }}>
                                {item.label.substring(0, 3)}
                            </div>
                        </div>

                        {/* Center: Icon + Temp Stack (Horizontal Cluster) */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start', // Align left-center
                            gap: '3rem'
                        }}>
                            <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                                {getIcon(item.condition)}
                            </div>

                            {/* Temp Stack */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                <span style={{ fontSize: '4.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                                    {Math.round(item.tempHigh || item.temp)}°
                                </span>
                                {item.tempLow !== undefined && (
                                    <span style={{ fontSize: '2.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                                        / {Math.round(item.tempLow)}°
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Vertical Stack of Secondary Data */}
                        <div style={{
                            flex: '0 0 25%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '0.4rem',
                            textAlign: 'right'
                        }}>
                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.9)',
                                marginBottom: '0.2rem'
                            }}>
                                {item.condition}
                            </div>

                            {/* Metrics Row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <LuCloudRain size={16} color="#fff" />
                                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>{item.precip || item.pop || 0}%</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <LuWind size={16} color="#fff" />
                                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>{item.wind}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
