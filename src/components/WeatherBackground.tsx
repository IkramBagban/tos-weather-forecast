import React, { useMemo, useState, useEffect } from 'react';
import { ForecastItem } from '../types';
import { getDynamicBackground, getWeatherBackgroundImage, isVideo } from '../utils/weatherHelpers';

interface WeatherBackgroundProps {
    bgType: string;
    bgColor: string;
    bgUrl: string;
    bgOpacity: number;
    currentCondition: string;
    forecastData: ForecastItem[];
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
    bgType, bgColor, bgUrl, bgOpacity, currentCondition, forecastData
}) => {

    const opacityValue = (bgOpacity ?? 100) / 100;

    // State to track if the mapped image loads successfully
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);

    // Calculate dynamic gradient (Always active as base/fallback)
    const dynamicGradient = useMemo(() => {
        return getDynamicBackground(currentCondition, forecastData);
    }, [currentCondition, forecastData]);

    // Determine target image based on condition
    const mappedImage = useMemo(() => {
        let cond = currentCondition;
        if (!cond && forecastData.length > 0) cond = forecastData[0].condition;
        return getWeatherBackgroundImage(cond || '');
    }, [currentCondition, forecastData]);

    // Effect: Try to load the image when it changes
    useEffect(() => {
        if (!mappedImage) {
            setImageLoaded(false);
            return;
        }

        console.log(`[DEBUG] Attempting to load background image: ${mappedImage} for condition: ${currentCondition}`);
        setLoadingImage(true);
        const img = new Image();
        img.src = mappedImage;

        img.onload = () => {
            console.log(`[DEBUG] Image loaded successfully: ${mappedImage}`);
            setImageLoaded(true);
            setLoadingImage(false);
        };

        img.onerror = () => {
            console.warn(`[DEBUG] Failed to load image: ${mappedImage}. Fallback to gradient active.`);
            setImageLoaded(false);
            setLoadingImage(false);
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [mappedImage, currentCondition]);


    const commonStyle: React.CSSProperties = {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: -1, opacity: opacityValue, transition: 'all 1s ease',
    };

    // 1. User Selected Media (Highest Priority in Settings)
    if (bgType === 'image' && bgUrl) {
        if (isVideo(bgUrl)) {
            return <video src={bgUrl} autoPlay loop muted playsInline style={{ ...commonStyle, objectFit: 'cover' }} />;
        }
        return <div style={{ ...commonStyle, backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />;
    }

    // 2. User Selected Solid Color
    if (bgType === 'solid') {
        return <div style={{ ...commonStyle, backgroundColor: bgColor }} />;
    }

    // 3. Dynamic Hybrid Logic
    // Render Gradient AND Image if loaded. 

    const finalStyle = (imageLoaded && mappedImage)
        ? { ...commonStyle, backgroundImage: `url(${mappedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { ...commonStyle, background: dynamicGradient };

    return <div style={finalStyle} />;
};
