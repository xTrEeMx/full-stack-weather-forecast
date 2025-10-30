'use client';
import { useState } from 'react';
import { fetchWeather, fetchForecast } from '@/app/lib/openweather';

export default function Home() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [days, setDays] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!city.trim()) {
            setError('Please enter a city to continue.');
            setWeather(null);
            setForecast([]);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const weatherData = await fetchWeather(city);
            const forecastData = await fetchForecast(city, days); // Pass 'days' here

            const dailyForecast = getDailyForecast(forecastData.list, days);

            setWeather(weatherData);
            setForecast(dailyForecast);
        } catch (error) {
            console.error('Failed to fetch weather or forecast:', error);
            setError('Unable to fetch weather data right now. Please try again in a moment.');
        } finally {
            setIsLoading(false);
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

    const metrics = weather
        ? [
              { label: 'Wind', value: `${Math.round(weather.wind.speed)} km/h` },
              { label: 'Humidity', value: `${weather.main.humidity}%` },
              { label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
          ]
        : [];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-48 -left-24 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -bottom-56 -right-20 h-[28rem] w-[28rem] rounded-full bg-purple-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />
            </div>

            <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 py-16">
                <header className="max-w-3xl text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.4em] text-cyan-300/80">Live weather insights</p>
                    <h1 className="mt-4 text-balance text-4xl font-semibold md:text-6xl">
                        Plan your day with a sleek, modern forecast
                    </h1>
                    <p className="mt-6 text-lg text-slate-300">
                        Search any city worldwide to see current conditions and a multi-day outlook wrapped in a clean, contemporary interface.
                    </p>
                </header>

                <section className="mt-12 w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_-20px_rgba(56,189,248,0.8)] backdrop-blur-2xl">
                    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                        <label className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-slate-900/60 px-5 py-4 ring-1 ring-white/5 transition focus-within:ring-2 focus-within:ring-cyan-400/60">
                            <svg
                                className="h-5 w-5 text-cyan-300 transition group-focus-within:scale-105"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M5 11a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" />
                            </svg>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter a city e.g. Tokyo"
                                className="w-full bg-transparent text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
                            />
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="rounded-2xl bg-slate-900/60 px-5 py-4 text-base font-medium text-slate-100 ring-1 ring-white/5 transition hover:ring-cyan-300/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                        >
                            <option className="bg-slate-900" value="3">
                                3 Days
                            </option>
                            <option className="bg-slate-900" value="5">
                                5 Days
                            </option>
                            <option className="bg-slate-900" value="7">
                                7 Days
                            </option>
                            <option className="bg-slate-900" value="10">
                                10 Days
                            </option>
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-[-2px] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0-4 4m4-4H3" />
                            </svg>
                        )}
                        {isLoading ? 'Fetching weather...' : 'Show forecast'}
                    </button>

                    {error && <p className="mt-4 text-sm text-red-300/90">{error}</p>}
                </section>

                {weather && (
                    <section className="mt-12 w-full max-w-5xl">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                            <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-8 shadow-[0_0_50px_-20px_rgba(168,85,247,0.7)]">
                                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Current conditions</p>
                                            <h2 className="mt-3 text-4xl font-semibold text-white">{weather.name}</h2>
                                            <p className="mt-1 text-sm text-slate-300">{new Date().toDateString()}</p>
                                        </div>
                                        <div className="text-cyan-200/80">
                                            <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15Z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center gap-8">
                                        <div className="text-6xl font-semibold md:text-7xl">{Math.round(weather.main.temp)}°</div>
                                        <div className="space-y-2 text-slate-200">
                                            <p className="text-xl font-medium">{weather.weather[0].main}</p>
                                            <p className="text-sm text-slate-300">
                                                Feels like {Math.round(weather.main.feels_like)}° · High {Math.round(weather.main.temp_max)}° · Low {Math.round(weather.main.temp_min)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <aside className="grid gap-4">
                                {metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_45px_-25px_rgba(56,189,248,0.6)]"
                                    >
                                        <p className="text-xs uppercase tracking-[0.25em] text-slate-300/80">{metric.label}</p>
                                        <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                                    </div>
                                ))}
                            </aside>
                        </div>
                    </section>
                )}

                {forecast && forecast.length > 0 && (
                    <section className="mt-14 w-full max-w-5xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white">Upcoming forecast</h3>
                            <span className="text-sm text-slate-300">Next {forecast.length} days</span>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {forecast.map((day, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_60px_-30px_rgba(147,51,234,0.7)] transition-transform hover:-translate-y-1"
                                >
                                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                                    <p className="text-sm text-slate-300">
                                        {new Date(day.dt_txt).toLocaleDateString('en-GB', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <div className="mt-6 flex items-end justify-between">
                                        <div>
                                            <p className="text-4xl font-semibold text-white">{Math.round(day.main.temp)}°</p>
                                            <p className="mt-1 text-base text-slate-300">{day.weather[0].main}</p>
                                        </div>
                                        <div className="text-cyan-200/80">
                                            <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
