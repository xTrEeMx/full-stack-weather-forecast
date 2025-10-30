const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (city) => {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);

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

export const fetchForecast = async (city, days) => {
    try {
        const cnt = days * 8; // 8 data points per day (3-hour intervals)
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&cnt=${cnt}&units=metric&appid=${API_KEY}`);

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
