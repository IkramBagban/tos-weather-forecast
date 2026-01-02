import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { LuWind, LuCloudRain } from 'react-icons/lu';
import '../../views/Render.css';

export const LayoutHorizontal: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    // 16:9 "Cinematic Timeline" Layout
    // Left: Header Glass Card
    // Right: Forecast Rail

    return (
        <div className="render__content" style={{
            ...contentStyle,
            flexDirection: 'row', // Horizontal layout
            alignItems: 'stretch',
            gap: '2rem',
            padding: '2rem' // Generous padding
        }}>
            {/* 1. Header Glass Card (Far Left) */}
            <header className="glass-bento" style={{
                flex: '0 0 25%', // Fixed width for header
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center', // Center vertically
                padding: '3rem',
                textAlign: 'left'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Location Name - Huge */}
                    <h1 style={{
                        fontSize: '4.5rem', // 700 weight
                        fontWeight: 700,
                        lineHeight: 1.1,
                        margin: 0,
                        color: '#fff'
                    }}>
                        {locationName}
                    </h1>

                    <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}></div>

                    {/* Time & Date */}
                    <div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                            {formatTime(currentTime)}
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginTop: '0.75rem' }}>
                            {formatDate(currentTime)}
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Forecast Rail (Right) - Flex container of identical bento cards */}
            <div className="glass-bento" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                padding: '2rem', // Inner rail padding
                gap: '1.5rem',
                overflow: 'hidden' // Ensure clean cut
            }}>
                {forecastData.slice(0, 5).map((item, i) => (
                    <div key={i} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        padding: '1rem 0.5rem'
                    }}>
                        {/* Anatomy Top: Day Name (Huge & Bold) */}
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: '#fff',
                            marginBottom: '1rem'
                        }}>
                            {item.label}
                        </div>

                        {/* Middle: Icon + Temp Stack */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            {/* Icon */}
                            <div style={{ fontSize: '7rem', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}>
                                {getIcon(item.condition)}
                            </div>

                            {/* Temp Stack (High Bold / Low Small) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                                <span style={{ fontSize: '4rem', fontWeight: 800, color: '#fff' }}>
                                    {Math.round(item.tempHigh || item.temp)}°
                                </span>
                                {item.tempLow !== undefined && (
                                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                                        {Math.round(item.tempLow)}°
                                    </span>
                                )}
                            </div>

                            {/* Condition Text (Tier 2) */}
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.9)',
                                marginTop: '0.5rem',
                                maxWidth: '90%',
                                lineHeight: 1.2
                            }}>
                                {item.condition}
                            </div>
                        </div>

                        {/* Footer: Micro-Metrics (Tier 3) */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            width: '100%',
                            justifyContent: 'center'
                        }}>
                            {/* Precip */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.8 }}>
                                <LuCloudRain size={20} color="#fff" />
                                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{item.precip || item.pop || 0}%</span>
                            </div>
                            {/* Wind */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.8 }}>
                                <LuWind size={20} color="#fff" />
                                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#fff' }}>{item.wind}</span>
                            </div>
                        </div>

                        {/* Divider for all but last */}
                        {i < 4 && (
                            <div style={{
                                position: 'absolute',
                                right: '-0.75rem',
                                top: '10%',
                                bottom: '10%',
                                width: '1px',
                                background: 'rgba(255,255,255,0.1)'
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
