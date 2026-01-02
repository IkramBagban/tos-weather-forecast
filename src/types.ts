import React from 'react';

export interface ForecastItem {
    timestamp: number;
    label: string; // "3 PM" or "Mon"
    temp: number;
    tempHigh?: number; // Daily High (for 2d-7d views)
    tempLow?: number;  // Daily Low (for 2d-7d views)
    condition: string;
    icon: any; // Changed to any to support React Nodes from react-icons
    humidity?: number;
    wind?: number;
    precip?: number;
    pop?: number; // Probability of Precipitation (alias for precip in some contexts)
    feelsLike?: number;
}

export interface WeatherLayoutProps {
    forecastData: ForecastItem[];
    currentCondition: string;
    locationName: string;
    unitLabel: string;
    formatTime: (date: Date) => string;
    formatDate: (date: Date) => string;
    currentTime: Date;
    contentStyle?: React.CSSProperties;
}
