'use client';
import { useState } from 'react';
import { fetchWeather, fetchForecast } from '@/app/lib/openweather';

export default function Home() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [days, setDays] = useState(3);

    const handleSearch = async () => {
        try {
            const weatherData = await fetchWeather(city);
            const forecastData = await fetchForecast(city, days); // Pass 'days' here

            const dailyForecast = getDailyForecast(forecastData.list, days);

            setWeather(weatherData);
            setForecast(dailyForecast);
        } catch (error) {
            console.error('Failed to fetch weather or forecast:', error);
        }
    };

    // Function to filter forecast data to one entry per day
    const getDailyForecast = (forecastList, daysToShow) => {
        const dailyMap = new Map();

        forecastList.forEach((item) => {
            const date = new Date(item.dt_txt).toLocaleDateString('en-GB'); // Get the day (dd/mm/yyyy)

            const hour = new Date(item.dt_txt).getHours();
            // Select the forecast closest to midday (12:00 PM)
            if (!dailyMap.has(date) || Math.abs(hour - 12) < Math.abs(new Date(dailyMap.get(date).dt_txt).getHours() - 12)) {
                dailyMap.set(date, item);
            }
        });

        // Limit the forecast to the requested number of days
        return Array.from(dailyMap.values()).slice(0, daysToShow);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Weather Forecast</h1>

            {/* Search Area */}
            <div className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="w-full p-4 rounded-lg shadow-lg bg-white text-gray-900 text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                />
                <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full p-4 rounded-lg shadow-lg bg-white text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                >
                    <option value="3">3 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                    <option value="10">10 Days</option>
                </select>

                <button
                    onClick={handleSearch}
                    className="w-full bg-purple-500 text-white font-semibold p-4 rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
                >
                    Search
                </button>
            </div>

            {/* Current Weather Card */}
            {weather && (
                <div className="bg-white rounded-lg shadow-xl p-6 mt-8 w-full max-w-md">
                    <div className="text-2xl font-bold text-gray-900">{weather.name}</div>
                    <div className="text-md text-gray-600">
                        {new Date().toDateString()}
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="text-purple-500">
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center ml-6">
                            <div className="text-6xl font-extrabold text-gray-900">{Math.round(weather.main.temp)}°</div>
                            <div className="text-lg text-gray-700">{weather.weather[0].main}</div>
                            <div className="text-sm text-gray-500 mt-1">
                                <span>High: {Math.round(weather.main.temp_max)}°</span> |{' '}
                                <span>Low: {Math.round(weather.main.temp_min)}°</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between text-sm text-gray-700">
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">Wind</span>
                            <span>{weather.wind.speed} km/h</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">Humidity</span>
                            <span>{weather.main.humidity}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">Visibility</span>
                            <span>{weather.visibility / 1000} km</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Forecast Cards */}
            {forecast && (
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {forecast.map((day, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-xl p-4 text-center">
                            <div className="text-lg font-bold text-gray-900">
                                {new Date(day.dt_txt).toLocaleDateString('en-GB', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="flex justify-center mt-4">
                                <div className="text-purple-500">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                                    </svg>
                                </div>
                                <div className="ml-4 text-4xl font-extrabold text-gray-900">
                                    {Math.round(day.main.temp)}°
                                </div>
                            </div>
                            <div className="text-lg text-gray-700 mt-2">{day.weather[0].main}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
