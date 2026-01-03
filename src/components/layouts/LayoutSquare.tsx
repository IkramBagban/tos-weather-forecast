import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { Wind, Droplets, MapPin, Calendar } from 'lucide-react';
import '../../views/Render.css';

export const LayoutSquare: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {

    // Detailed Focus on the first available item (Today/Tomorrow)
    const highlightItem = forecastData[0];
    const isDay = highlightItem.label.toLowerCase().includes('day') || !highlightItem.label.includes('pm') && !highlightItem.label.includes('am'); // Simple check, or just assume

    return (
        <div className="render__content" style={{ ...contentStyle, padding: '2rem' }}>
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', zIndex: 10 }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-rain)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>
                            Next 24 Hours
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.1 }}>{locationName}</h2>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 300, color: '#fff' }}>{formatDate(currentTime).split(',')[0]}</div> {/* Approx date/day */}
                    </div>
                </div>

                {/* Hero Card */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 10 }}>

                    {/* Main Temperature Card */}
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)', zIndex: 0 }}></div>

                        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Outlook</span>
                            <span style={{ fontSize: '4rem', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{Math.round(highlightItem.temp)}°</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Feels like {Math.round(highlightItem.feelsLike || highlightItem.temp)}°</span>
                        </div>

                        <div style={{ position: 'relative', zIndex: 10, fontSize: '5rem', filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.4))' }}>
                            {getIcon(highlightItem.condition)}
                        </div>
                    </div>

                    {/* Secondary Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <Droplets size={16} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Precip</span>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>{highlightItem.precip || highlightItem.pop || 0}%</span>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <Wind size={16} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Wind</span>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>
                                {highlightItem.wind} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>mph</span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
