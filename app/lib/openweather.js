const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export const fetchWeather = async (city, units = 'metric') => {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

export const fetchForecast = async (city, days, units = 'metric') => {
    try {
        const cnt = days * 8; // 8 data points per day (3-hour intervals)
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&cnt=${cnt}&units=${units}&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
};

export const fetchAdditionalConditions = async (lat, lon, units = 'metric') => {
    try {
        const response = await fetch(
            `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=${units}&appid=${API_KEY}`,
        );

        if (!response.ok) {
            throw new Error('Failed to fetch additional condition data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching additional condition data:', error);
        throw error;
    }
};

export const fetchWeatherByCoordinates = async (lat, lon, units = 'metric') => {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data by coordinates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data by coordinates:', error);
        throw error;
    }
};

export const fetchForecastByCoordinates = async (lat, lon, days, units = 'metric') => {
    try {
        const cnt = days * 8;
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&units=${units}&appid=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch forecast data by coordinates');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data by coordinates:', error);
        throw error;
    }
};

export const fetchCitySuggestions = async (query, limit = 5, signal) => {
    if (!query) {
        return [];
    }

    try {
        const response = await fetch(
            `${GEO_BASE_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`,
            { signal },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch city suggestions');
        }

        const data = await response.json();
        return data.map((item) => ({
            name: item.name,
            state: item.state ?? '',
            country: item.country ?? '',
            lat: item.lat,
            lon: item.lon,
        }));
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error;
        }

        console.error('Error fetching city suggestions:', error);
        throw error;
    }
};

export const fetchCityByCoordinates = async (lat, lon, signal) => {
    try {
        const response = await fetch(
            `${GEO_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
            { signal },
        );

        if (!response.ok) {
            throw new Error('Failed to fetch city name by coordinates');
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const { name, state, country } = data[0];
        return [name, state, country].filter(Boolean).join(', ');
    } catch (error) {
        if (error.name === 'AbortError') {
            throw error;
        }

        console.error('Error fetching city name by coordinates:', error);
        throw error;
    }
};

// export const fetchForecast = async (city, days) => {
//     try {
//         const response = await fetch(`${BASE_URL}/forecast?q=${city}&cnt=${days}&units=metric&appid=${API_KEY}`);
//
//         if (!response.ok) {
//             throw new Error('Failed to fetch forecast data');
//         }
//
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Error fetching forecast data:', error);
//         throw error;
//     }
// };
