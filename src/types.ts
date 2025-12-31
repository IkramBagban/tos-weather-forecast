export interface ForecastItem {
    timestamp: number;
    label: string; // "3 PM" or "Mon"
    temp: number;
    condition: string;
    icon: string;
    humidity?: number;
    wind?: number;
    precip?: number;
    feelsLike?: number;
}
