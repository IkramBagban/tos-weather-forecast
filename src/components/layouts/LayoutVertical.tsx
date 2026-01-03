import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { Wind, Droplets, MapPin, Calendar } from 'lucide-react';
import '../../views/Render.css';

export const LayoutVertical: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    // vertical-layout specific overrides
    const verticalContainerStyle: React.CSSProperties = {
        ...contentStyle,
        overflowY: 'hidden',
        padding: '0'
    };

    const highlightItem = forecastData[0]; // Usually Tomorrow/Next
    const upcoming = forecastData.slice(1, 6); // Next 5 days

    return (
        <div className="render__content" style={verticalContainerStyle}>
            {/* Header Area */}
            <header style={{ padding: '2rem 2rem 1rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <MapPin size={24} color="#a1a1aa" />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 600, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{locationName}</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingLeft: '0.25rem' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem', fontWeight: 500 }}>Upcoming 5 Days</p>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{formatTime(currentTime)}</div>
                    </div>
                </div>
            </header>

            {/* Hero Card (Highlighted) */}
            <div style={{ padding: '0 2rem 1.5rem 2rem' }}>
                <div className="glass-panel bg-gradient-rain" style={{
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    {/* Decorative Icon BG */}
                    <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'scale(1.5)', pointerEvents: 'none' }}>
                        {getIcon(highlightItem.condition)}
                    </div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                                    {highlightItem.label}
                                </span>
                                <div style={{ fontSize: '5.5rem', fontWeight: 600, lineHeight: 0.9, marginTop: '0.75rem', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>
                                    {Math.round(highlightItem.temp)}°
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 500 }}>{highlightItem.condition}</div>
                            </div>
                            <div style={{ fontSize: '6rem', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.2))' }}>
                                {getIcon(highlightItem.condition)}
                            </div>
                        </div>

                        {/* Metrics Grid inside Hero */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Droplets size={20} color="rgba(255,255,255,0.8)" />
                                <div>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '2px' }}>Precip</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{highlightItem.precip || highlightItem.pop || 0}%</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Wind size={20} color="rgba(255,255,255,0.8)" />
                                <div>
                                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '2px' }}>Wind</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{highlightItem.wind}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List for Upcoming */}
            <div style={{ flex: 1, overflow: 'hidden', padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcoming.map((item, i) => (
                    <div key={i} className="glass-panel" style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '16px',
                        background: 'rgba(24, 24, 27, 0.4)',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '3.5rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'uppercase' }}>{item.label.substring(0, 3)}</div>
                            <div style={{ fontSize: '2rem' }}>{getIcon(item.condition)}</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.condition}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, alignItems: 'center' }}>
                            <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>{Math.round(item.temp)}°</span>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '1.25rem' }}>{item.feelsLike ? Math.round(item.feelsLike) : Math.round(item.temp - 5)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
