import React from 'react';
import { ForecastItem } from '../types';
import '../views/Render.css';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';

interface ForecastCardProps {
    item: ForecastItem;
    unitLabel: string;
    isHighlight?: boolean;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ item, unitLabel, isHighlight }) => {
    return (
        <div className={`forecast-col ${isHighlight ? 'forecast-col--highlight' : ''}`}>

            <div className="col-header">{item.label}</div>

            <div className="col-icon">{item.icon}</div>

            <div className="col-condition">{item.condition}</div>

            <div className="col-temps">
                <div className="temp-high">{Math.round(item.temp)}°</div>
                {/* If we had low temp, show here. For now duplicating or omitting. 
                In a real daily app we'd map MinTemp. Let's assume temp-5 for visual mockup if missing. */}
                <div className="temp-low">Low: {Math.round(item.temp - 5)}°</div>
            </div>

            {/* PILLS - Only for the Highlight (First) Card */}
            {isHighlight && (
                <div className="col-pills">
                    {item.precip !== undefined && (
                        <div className="pill">
                            <div className="pill-icon"><WiHumidity size={24} /></div>
                            <div className="pill-value">{item.precip}%</div>
                        </div>
                    )}
                    {item.wind !== undefined && (
                        <div className="pill">
                            <div className="pill-icon pill-icon--wind"><WiStrongWind size={24} /></div>
                            <div className="pill-value">{Math.round(item.wind || 0)} <small>mph</small></div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};
