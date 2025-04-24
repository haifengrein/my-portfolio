---
title: "Weather Dashboard Application"
date: 2024-02-20
image: "/images/projects/weather-app-screenshot.jpg"
description: "A full-featured weather dashboard app built with React, displaying real-time weather data, forecasts, and interactive maps. Demonstrates integration with multiple APIs and responsive design."
tags: ["React", "API Integration", "JavaScript", "CSS3", "Responsive Design"]
sourceUrl: "https://github.com/yourusername/weather-dashboard"
liveUrl: "https://weather-app-demo.vercel.app"
weight: 4
---

## Project Overview

The Weather Dashboard is a comprehensive web application that provides users with detailed weather information for any location worldwide. Built with React, this project showcases my ability to create feature-rich applications that integrate multiple data sources and present complex information in an intuitive, user-friendly interface.

![Weather Dashboard Main Interface](/images/projects/weather-app-main.jpg)

This application combines real-time weather data with interactive visualizations to help users understand current conditions and upcoming forecasts at a glance.

## Core Features

### Multi-Location Weather Tracking

Users can search for and save multiple locations to track weather conditions across different cities simultaneously:

```javascript
// Location search component with autocomplete
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSearch = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/search.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${query}`
        );
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  return (
    <div className="location-search">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for a city..."
        className="search-input"
      />
      
      {isLoading && <div className="loading-indicator">Searching...</div>}
      
      <ul className="results-list">
        {results.map(location => (
          <li 
            key={`${location.lat}-${location.lon}`}
            onClick={() => onLocationSelect(location)}
            className="result-item"
          >
            {location.name}, {location.region}, {location.country}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationSearch;
```

### Interactive Weather Map

The application includes an interactive map that visualizes temperature, precipitation, and wind patterns:

![Weather Interactive Map](/images/projects/weather-app-map.jpg)

This feature was implemented using the Leaflet.js library with custom layers for weather data:

```javascript
// Weather map component
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ center, zoom, layers }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lon], 
        zoom || 10
      );
      
      // Add base tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    } else {
      // Update map center and zoom if changed
      mapInstanceRef.current.setView([center.lat, center.lon], zoom || 10);
    }
    
    // Clear existing layers
    mapInstanceRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer === false) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    
    // Add selected weather layers
    if (layers.includes('temperature')) {
      L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPENWEATHER_KEY}`)
        .addTo(mapInstanceRef.current);
    }
    
    if (layers.includes('precipitation')) {
      L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPENWEATHER_KEY}`)
        .addTo(mapInstanceRef.current);
    }
    
    if (layers.includes('wind')) {
      L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${process.env.REACT_APP_OPENWEATHER_KEY}`)
        .addTo(mapInstanceRef.current);
    }
    
    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current && !mapRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, layers]);
  
  return <div ref={mapRef} className="weather-map" style={{ height: '500px', width: '100%' }} />;
};

export default WeatherMap;
```

### Detailed Forecast Visualization

The application provides detailed 7-day forecasts with interactive graphs for temperature, humidity, and wind speed:

```jsx
// Temperature trend chart component
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const TemperatureChart = ({ forecastData }) => {
  const dates = forecastData.map(day => day.date);
  const maxTemps = forecastData.map(day => day.maxtemp_c);
  const minTemps = forecastData.map(day => day.mintemp_c);
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Max Temperature (°C)',
        data: maxTemps,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Min Temperature (°C)',
        data: minTemps,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.4
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };
  
  return (
    <div className="chart-container">
      <h3>Temperature Forecast</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default TemperatureChart;
```

## Technical Architecture

### Frontend Architecture

The application follows a component-based architecture using React hooks and context API for state management:

![Weather App Architecture](/images/projects/weather-app-architecture.jpg)

### Key Technologies

This project leverages several modern web technologies:

- **React**: For the UI component system and state management
- **APIs**: Integration with OpenWeatherMap API and WeatherAPI
- **Chart.js**: For data visualization components
- **Leaflet.js**: For interactive mapping
- **Axios**: For API requests with interceptors for error handling
- **CSS Modules**: For component-scoped styling
- **LocalStorage**: For persisting user preferences

## API Integration

The application uses a custom hook to handle API requests efficiently:

```javascript
// Custom API hook with caching
import { useState, useEffect } from 'react';
import axios from 'axios';

const useWeatherApi = (location, options = {}) => {
  const { cacheTime = 30 * 60 * 1000 } = options; // Default 30 mins cache
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!location) {
        setData(null);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Check for cached data
      const cacheKey = `weather_data_${location.lat}_${location.lon}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { data: parsedData, timestamp } = JSON.parse(cachedData);
        
        // Use cached data if it's still valid
        if (Date.now() - timestamp < cacheTime) {
          setData(parsedData);
          setIsLoading(false);
          return;
        }
      }
      
      // Fetch fresh data if no valid cache exists
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location.lat},${location.lon}&days=7&aqi=yes&alerts=yes`
        );
        
        // Cache the new data
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
        
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch weather data');
        console.error('Weather API error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [location, cacheTime]);
  
  return { data, isLoading, error };
};

export default useWeatherApi;
```

## Responsive Design Implementation

The application adapts seamlessly to different screen sizes through carefully crafted CSS:

```css
/* Responsive design using CSS variables and media queries */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-xxl: 2rem;
  
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  
  --container-width: 1200px;
}

.weather-dashboard {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing-md);
}

.weather-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 1024px) {
  .forecast-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .forecast-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .weather-map {
    height: 300px !important;
  }
}

@media (max-width: 480px) {
  .forecast-grid {
    grid-template-columns: 1fr;
  }
  
  :root {
    --spacing-lg: 1rem;
    --font-size-xl: 1.25rem;
    --font-size-xxl: 1.5rem;
  }
  
  .weather-dashboard {
    padding: var(--spacing-sm);
  }
}
```

## Performance Optimization

Several techniques were implemented to ensure optimal performance:

1. **API Data Caching**: Weather data is cached in localStorage to reduce API calls
2. **Code Splitting**: Using React's lazy loading to split bundles
3. **Debounced Search**: Reduced API calls during location search
4. **Optimized Renders**: Using React.memo and useMemo for expensive calculations

```javascript
// Code splitting example
import React, { lazy, Suspense } from 'react';

// Lazy loaded components
const WeatherMap = lazy(() => import('./components/WeatherMap'));
const ForecastDetails = lazy(() => import('./components/ForecastDetails'));
const WeatherAlerts = lazy(() => import('./components/WeatherAlerts'));

const WeatherDashboard = ({ location }) => {
  return (
    <div className="weather-dashboard">
      {/* Main weather display always loaded */}
      <CurrentWeather location={location} />
      
      {/* Lazily loaded components */}
      <Suspense fallback={<div className="loading-skeleton">Loading map...</div>}>
        <WeatherMap center={location} layers={['temperature']} />
      </Suspense>
      
      <Suspense fallback={<div className="loading-skeleton">Loading forecast...</div>}>
        <ForecastDetails location={location} />
      </Suspense>
      
      <Suspense fallback={<div className="loading-skeleton">Loading alerts...</div>}>
        <WeatherAlerts location={location} />
      </Suspense>
    </div>
  );
};
```

## User Experience Considerations

Special attention was paid to user experience details:

1. **Loading States**: Skeleton screens during data fetching
2. **Error Handling**: User-friendly error messages with recovery options
3. **Offline Support**: Basic functionality when offline using cached data
4. **Accessibility**: ARIA attributes and keyboard navigation support

## Testing Strategy

The application was thoroughly tested using:

```javascript
// Jest unit test example for temperature conversion utility
import { convertTemperature } from '../utils/temperatureUtils';

describe('Temperature Conversion Utility', () => {
  test('converts celsius to fahrenheit correctly', () => {
    expect(convertTemperature(0, 'C', 'F')).toBe(32);
    expect(convertTemperature(100, 'C', 'F')).toBe(212);
    expect(convertTemperature(-40, 'C', 'F')).toBe(-40);
  });
  
  test('converts fahrenheit to celsius correctly', () => {
    expect(convertTemperature(32, 'F', 'C')).toBe(0);
    expect(convertTemperature(212, 'F', 'C')).toBe(100);
    expect(convertTemperature(-40, 'F', 'C')).toBe(-40);
  });
  
  test('returns original value when same unit is specified', () => {
    expect(convertTemperature(25, 'C', 'C')).toBe(25);
    expect(convertTemperature(70, 'F', 'F')).toBe(70);
  });
  
  test('handles decimal values', () => {
    expect(convertTemperature(37.5, 'C', 'F')).toBeCloseTo(99.5);
    expect(convertTemperature(98.6, 'F', 'C')).toBeCloseTo(37.0);
  });
  
  test('throws error for invalid units', () => {
    expect(() => convertTemperature(25, 'X', 'F')).toThrow();
    expect(() => convertTemperature(70, 'F', 'Y')).toThrow();
  });
});
```

## Lessons Learned

This project provided valuable insights into:

1. **API Integration Challenges**: Handling rate limits and data inconsistencies
2. **State Management Complexity**: Balancing local vs. global state
3. **Performance Optimization**: Identifying and resolving bottlenecks
4. **Cross-Browser Compatibility**: Addressing differences in geolocation API support

## Future Improvements

The application has potential for several enhancements:

1. Adding support for weather alerts and notifications
2. Implementing PWA features for better offline experience
3. Adding historical weather data charts
4. Integrating more detailed radar maps
5. Supporting user accounts to sync preferences across devices

This weather dashboard project demonstrates my ability to create complex, data-driven applications with polished user interfaces and thoughtful architecture decisions.
