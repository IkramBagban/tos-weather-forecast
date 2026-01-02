import React from 'react';
import { WeatherLayoutProps } from '../../types';
import { getIcon } from '../../utils/weatherHelpers';
import { LuMap, LuNavigation, LuCalendar } from 'react-icons/lu';
import '../../views/Render.css';

export const LayoutWide: React.FC<WeatherLayoutProps> = ({
    forecastData,
    locationName,
    formatTime,
    formatDate,
    currentTime,
    contentStyle
}) => {
    return (
        <div className="render__content" style={{ ...contentStyle, flexDirection: 'row', padding: '0', gap: 0 }}>

            {/* Sidebar info */}
            <div style={{
                width: '18%',
                background: 'rgba(9, 9, 11, 0.4)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 10
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        <LuNavigation size={20} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em' }}>LOCATION</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 600, color: '#fff', lineHeight: 1.1, wordWrap: 'break-word' }}>
                        {locationName}
                    </h2>
                </div>

                <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>Forecast</div>
                    <div style={{ fontSize: '2rem', fontWeight: 500 }}>5 Days</div>
                    <div style={{ marginTop: '0.5rem', fontSize: '1rem', color: 'var(--text-tertiary)' }}>{formatDate(currentTime)}</div>
                </div>
            </div>

            {/* Timeline Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${forecastData.length}, 1fr)`, position: 'relative' }}>
                {/* Background Grid Lines handled by flex/grid gap or borders */}

                {forecastData.map((item, i) => (
                    <div key={i} style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2.5rem 1rem',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        background: i === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        transition: 'background 0.3s'
                    }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: i === 0 ? '#fff' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {item.label}
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
                                {getIcon(item.condition)}
                            </div>
                            {i === 0 && (
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', borderRadius: '12px', fontWeight: 600 }}>
                                    {item.condition}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{Math.round(item.temp)}°</span>
                            <span style={{ fontSize: '1.25rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{Math.round(item.feelsLike || item.temp - 5)}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
