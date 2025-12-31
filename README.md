# Weather Forecast App

A digital signage application for TelemetryOS that displays future weather predictions (hourly or daily) for multiple locations. Designed for clear visibility from a distance, focusing exclusively on upcoming forecasts.

## Features

- **Forecast Focused**: Displays 3h/8h/24h hourly or 2d-7d daily forecasts. No current conditions hero section.
- **Multi-Location**: Cycle through multiple cities with configurable duration and transition effects.
- **Auto-Location**: Option to automatically detect device location.
- **Visual Customization**:
    - Dynamic backgrounds that match weather conditions (Sunny, Rainy, Cloudy, etc.).
    - Option for Solid Color or Custom Image/Video backgrounds.
    - Configurable fonts, opacity, and UI scaling.
- **Responsive**: Adapts to standard 16:9, square, and ribbon aspect ratios.
- **Secondary Data**: Includes Humidity, Wind Speed, Precipitation Chance, and RealFeel temperatures.

## Configuration

This app is configured via the TelemetryTV Studio "Settings" panel.

### Locations
- **Detection Mode**: Choose "Manual" to enter a city name, or "Auto" to use the device's physical location.
- **Display Name Override**: Custom label for the location (e.g., "Headquarters" instead of "Vancouver").
- **Cycle Duration**: Seconds between location switches (Default: 10s).
- **Transition**: Fade, Slide, or Instant.
    
### Display Options
- **Forecast Range**: Select from Hourly (3h, 8h, 24h) or Daily (2d, 3d, 5d, 7d).
- **UI Scale**: Adjust size for different screen resolutions (0.5x - 3.0x).

### Visuals
- **Background Type**: Dynamic (Weather-based gradient), Solid Color, or Image/Video.
- **Font Color**: Customize text color for contrast.
- **Opacity**: Adjust background overlay opacity.

### Units & Formats
- **Temperature**: Celsius (°C) or Fahrenheit (°F).
- **Time/Date**: 12h/24h and various date formats.

## Development

### Setup
1.  Ensure you have Node.js installed.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```

### Building
To create a production build for TelemetryOS:
```bash
npm run build
```
The output will be in the `dist` directory.

## Architecture
- **Mounnt Points**: `/render` (Display) and `/settings` (Config).
- **State**: Uses `@telemetryos/sdk` store hooks for persistent configuration.
- **Weather API**: Uses SDK `weather()` proxy.
- **Styling**: Vanilla CSS with `useUiScaleToSetRem` for scaling.
