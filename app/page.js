'use client';
import { useEffect, useRef, useState } from 'react';
import {
    fetchWeather,
    fetchForecast,
    fetchAdditionalConditions,
    fetchWeatherByCoordinates,
    fetchForecastByCoordinates,
    fetchCitySuggestions,
    fetchCityByCoordinates,
} from '@/app/lib/openweather';

const translations = {
    en: {
        hero: {
            tagline: 'Live weather insights',
            title: 'Plan your day with a sleek, modern forecast',
            subtitle: 'Search any city worldwide to see current conditions and a multi-day outlook wrapped in a clean, contemporary interface.',
        },
        search: {
            placeholder: 'Enter a city e.g. Tokyo',
            location: 'Use my location',
            suggestionsSearching: 'Searching for cities...',
            suggestionsEmpty: 'No matches found.',
            suggestionsEmptyHint: 'Try another spelling or a nearby town.',
            suggestionsLabel: 'City suggestions',
            helper: 'Longer ranges reveal trends, while shorter ones keep things snappy.',
            suggestionAction: 'Tap to load weather for this city',
            buttonIdle: 'Show forecast',
            buttonLoading: 'Fetching weather...',
        },
        language: {
            label: 'Language',
            options: {
                en: 'English',
                bg: 'Български',
            },
        },
        units: {
            label: 'Units',
            metric: '°C · km/h',
            imperial: '°F · mph',
        },
        range: {
            label: 'Forecast range',
            helper: 'Longer ranges reveal trends, while shorter ones keep things snappy.',
            options: {
                3: { title: '3 Days', description: 'Quick snapshot outlook' },
                5: { title: '5 Days', description: 'Workweek planning' },
                7: { title: '7 Days', description: 'Full weekly view' },
                10: { title: '10 Days', description: 'Extended trends' },
            },
        },
        favorites: {
            button: 'Save city to favorites',
            buttonSaved: 'Saved to favorites',
            quickPicks: 'Quick picks',
            removeAria: 'Remove {city} from favorites',
        },
        metrics: {
            wind: 'Wind',
            windGust: 'Wind gust',
            humidity: 'Humidity',
            visibility: 'Visibility',
            pressure: 'Pressure',
        },
        solar: {
            sunrise: 'Sunrise',
            sunset: 'Sunset',
            uvIndex: 'UV index',
        },
        currentPanel: {
            tag: 'Current conditions',
            feelsLike: 'Feels like {feelsLike} · High {high} · Low {low}',
        },
        forecast: {
            heading: 'Upcoming forecast',
            summary: 'Next {count} days',
            highLow: 'High {high} · Low {low}',
            precip: '{chance} chance of precip',
            gusts: 'Gusts up to {gust}',
            wind: 'Wind {speed}',
        },
        errors: {
            missingCity: 'Please enter a city to continue.',
            fetchFailed: 'Unable to fetch weather data right now. Please try again in a moment.',
            locationUnsupported: 'Location detection is not supported in this browser.',
            locationFailed: 'We were unable to detect your location. Please enter a city manually.',
        },
    },
    bg: {
        hero: {
            tagline: 'Актуални метеорологични данни',
            title: 'Планирай деня си със стилна, модерна прогноза',
            subtitle:
                'Търси всеки град по света, за да видиш текущите условия и няколкодневната прогноза в изчистен, модерен интерфейс.',
        },
        search: {
            placeholder: 'Въведи град, напр. София',
            location: 'Моето местоположение',
            suggestionsSearching: 'Търсене на градове...',
            suggestionsEmpty: 'Няма намерени съвпадения.',
            suggestionsEmptyHint: 'Опитай друга правопис или близък град.',
            suggestionsLabel: 'Предложения за градове',
            helper: 'По-дългите периоди показват тенденции, а по-кратките са по-бързи.',
            suggestionAction: 'Избери, за да заредиш прогнозата за този град',
            buttonIdle: 'Покажи прогнозата',
            buttonLoading: 'Зареждане на прогноза...',
        },
        language: {
            label: 'Език',
            options: {
                en: 'English',
                bg: 'Български',
            },
        },
        units: {
            label: 'Единици',
            metric: '°C · км/ч',
            imperial: '°F · mph',
        },
        range: {
            label: 'Период на прогноза',
            helper: 'По-дългите периоди показват тенденции, а по-кратките са по-бързи.',
            options: {
                3: { title: '3 дни', description: 'Бърз преглед' },
                5: { title: '5 дни', description: 'Планиране на работната седмица' },
                7: { title: '7 дни', description: 'Пълен седмичен поглед' },
                10: { title: '10 дни', description: 'Разширени тенденции' },
            },
        },
        favorites: {
            button: 'Запази града в любими',
            buttonSaved: 'Добавено в любими',
            quickPicks: 'Бърз избор',
            removeAria: 'Премахни {city} от любими',
        },
        metrics: {
            wind: 'Вятър',
            windGust: 'Пориви на вятъра',
            humidity: 'Влажност',
            visibility: 'Видимост',
            pressure: 'Налягане',
        },
        solar: {
            sunrise: 'Изгрев',
            sunset: 'Залез',
            uvIndex: 'UV индекс',
        },
        currentPanel: {
            tag: 'Текущи условия',
            feelsLike: 'Усеща се като {feelsLike} · Максимум {high} · Минимум {low}',
        },
        forecast: {
            heading: 'Предстояща прогноза',
            summary: 'Следващите {count} дни',
            highLow: 'Макс {high} · Мин {low}',
            precip: '{chance} шанс за валежи',
            gusts: 'Пориви до {gust}',
            wind: 'Вятър {speed}',
        },
        errors: {
            missingCity: 'Моля, въведи град, за да продължиш.',
            fetchFailed: 'Не успяхме да заредим прогнозата в момента. Опитай отново след малко.',
            locationUnsupported: 'Откриването на местоположението не се поддържа в този браузър.',
            locationFailed: 'Не успяхме да определим местоположението ти. Въведи град ръчно.',
        },
    },
};

const dayOptionValues = [3, 5, 7, 10];

const localeFallbackMap = {
    en: 'en-GB',
    bg: 'bg-BG',
};

const formatMessage = (template, values) =>
    template.replace(/\{(\w+)\}/g, (_, key) => (values?.[key] ?? '').toString());

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [days, setDays] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [units, setUnits] = useState('metric');
    const [locale, setLocale] = useState('en');
    const [additionalConditions, setAdditionalConditions] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isRangeOpen, setIsRangeOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [lastSearch, setLastSearch] = useState({ cityName: '', coords: null });
    const [isLocating, setIsLocating] = useState(false);
    const rangeRef = useRef(null);

    const translation = translations[locale] ?? translations.en;
    const dateLocale = localeFallbackMap[locale] ?? localeFallbackMap.en;
    const localizedDayOptions = dayOptionValues.map((value) => ({
        value,
        title: translation.range.options[value]?.title ?? value,
        description: translation.range.options[value]?.description ?? '',
    }));
    const languageOptions = ['en', 'bg'];

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedFavorites = window.localStorage.getItem('favoriteCities');

        if (storedFavorites) {
            try {
                const parsed = JSON.parse(storedFavorites);

                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            } catch (storageError) {
                console.error('Unable to parse stored favorites:', storageError);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (rangeRef.current && !rangeRef.current.contains(event.target)) {
                setIsRangeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const trimmedQuery = searchTerm.trim();

        if (trimmedQuery.length < 2) {
            setSuggestions([]);
            setIsSuggesting(false);
            return;
        }

        let isActive = true;
        const controller = new AbortController();
        setIsSuggesting(true);

        const timeoutId = setTimeout(async () => {
            try {
                const results = await fetchCitySuggestions(trimmedQuery, 6, controller.signal, locale);

                if (isActive) {
                    setSuggestions(results);
                }
            } catch (suggestionError) {
                if (suggestionError.name !== 'AbortError' && isActive) {
                    console.error('Unable to load city suggestions:', suggestionError);
                }
            } finally {
                if (isActive) {
                    setIsSuggesting(false);
                }
            }
        }, 250);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [searchTerm, locale]);

    const formatTemperature = (temperature) => {
        if (temperature == null) {
            return '—';
        }

        const unitSuffix = units === 'metric' ? '°C' : '°F';
        return `${Math.round(temperature)}${unitSuffix}`;
    };

    const formatWindSpeed = (speed) => {
        if (speed == null) {
            return '—';
        }

        const convertedSpeed = units === 'metric' ? speed * 3.6 : speed;
        const label = units === 'metric' ? 'km/h' : 'mph';
        return `${Math.round(convertedSpeed)} ${label}`;
    };

    const formatVisibility = (visibilityInMeters) => {
        if (visibilityInMeters == null) {
            return '—';
        }

        if (units === 'metric') {
            return `${(visibilityInMeters / 1000).toFixed(1)} km`;
        }

        return `${(visibilityInMeters / 1609.34).toFixed(1)} mi`;
    };

    const formatTime = (timestamp, offsetSeconds = 0) => {
        if (!timestamp) {
            return '—';
        }

        return new Date((timestamp + offsetSeconds) * 1000).toLocaleTimeString(dateLocale, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrecipProbability = (probability) => `${Math.round((probability ?? 0) * 100)}%`;

    const selectedRange =
        localizedDayOptions.find((option) => option.value === days) ?? localizedDayOptions[0];
    const hasSuggestionQuery = searchTerm.trim().length >= 2;
    const shouldShowSuggestionPanel = hasSuggestionQuery && (isSuggesting || suggestions.length > 0);
    const shouldShowEmptySuggestions = hasSuggestionQuery && !isSuggesting && suggestions.length === 0;

    const performSearch = async (
        { cityName, coords },
        requestedDays = days,
        requestedUnits = units,
        requestedLocale = locale,
    ) => {
        const localeMessages = translations[requestedLocale] ?? translations.en;
        const trimmedCity = cityName?.trim() ?? '';
        const hasCoordinates = coords && typeof coords.lat === 'number' && typeof coords.lon === 'number';

        if (!trimmedCity && !hasCoordinates) {
            setError(localeMessages.errors.missingCity);
            setWeather(null);
            setForecast([]);
            setAdditionalConditions(null);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let weatherData;
            let forecastData;
            let resolvedCoords = coords;

            if (hasCoordinates) {
                weatherData = await fetchWeatherByCoordinates(
                    coords.lat,
                    coords.lon,
                    requestedUnits,
                    requestedLocale,
                );
                forecastData = await fetchForecastByCoordinates(
                    coords.lat,
                    coords.lon,
                    requestedDays,
                    requestedUnits,
                    requestedLocale,
                );
            } else {
                weatherData = await fetchWeather(trimmedCity, requestedUnits, requestedLocale);
                forecastData = await fetchForecast(
                    trimmedCity,
                    requestedDays,
                    requestedUnits,
                    requestedLocale,
                );
                resolvedCoords = weatherData?.coord
                    ? { lat: weatherData.coord.lat, lon: weatherData.coord.lon }
                    : null;
            }

            const dailyForecast = getDailyForecast(forecastData.list, requestedDays, requestedLocale);

            let climateData = null;

            try {
                climateData = await fetchAdditionalConditions(
                    weatherData.coord.lat,
                    weatherData.coord.lon,
                    requestedUnits,
                    requestedLocale,
                );
            } catch (climateError) {
                console.error('Unable to fetch additional conditions:', climateError);
            }

            setWeather(weatherData);
            setForecast(dailyForecast);
            setAdditionalConditions(climateData);
            setSuggestions([]);
            setIsSuggesting(false);

            const resolvedCityName = trimmedCity || weatherData?.name || cityName || '';
            setSearchTerm(resolvedCityName);
            setLastSearch({ cityName: resolvedCityName, coords: resolvedCoords });
        } catch (error) {
            console.error('Failed to fetch weather or forecast:', error);
            setError(localeMessages.errors.fetchFailed);
            setWeather(null);
            setForecast([]);
            setAdditionalConditions(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (
        input,
        requestedDays = days,
        requestedUnits = units,
        requestedLocale = locale,
    ) => {
        if (input?.preventDefault) {
            input.preventDefault();
        }

        if (typeof input === 'string') {
            await performSearch(
                { cityName: input, coords: null },
                requestedDays,
                requestedUnits,
                requestedLocale,
            );
            return;
        }

        if (input && typeof input === 'object' && (Object.prototype.hasOwnProperty.call(input, 'cityName') || Object.prototype.hasOwnProperty.call(input, 'coords'))) {
            await performSearch(
                {
                    cityName: input.cityName ?? searchTerm,
                    coords: input.coords ?? null,
                },
                requestedDays,
                requestedUnits,
                requestedLocale,
            );
            return;
        }

        await performSearch(
            { cityName: searchTerm, coords: null },
            requestedDays,
            requestedUnits,
            requestedLocale,
        );
    };

    const handleUnitsChange = (nextUnits) => {
        if (nextUnits === units) {
            return;
        }

        setUnits(nextUnits);

        if (lastSearch.cityName || lastSearch.coords) {
            handleSearch({ cityName: lastSearch.cityName, coords: lastSearch.coords }, days, nextUnits, locale);
        }
    };

    const handleRangeSelect = (value) => {
        setDays(value);
        setIsRangeOpen(false);

        if (lastSearch.cityName || lastSearch.coords) {
            handleSearch({ cityName: lastSearch.cityName, coords: lastSearch.coords }, value, units, locale);
        }
    };

    const handleLocaleChange = (nextLocale) => {
        if (nextLocale === locale) {
            return;
        }

        setLocale(nextLocale);

        if (lastSearch.cityName || lastSearch.coords) {
            handleSearch(
                { cityName: lastSearch.cityName, coords: lastSearch.coords },
                days,
                units,
                nextLocale,
            );
        }
    };

    const handleSaveFavorite = () => {
        if (!weather?.name) {
            return;
        }

        if (!favorites.includes(weather.name)) {
            setFavorites((prev) => [...prev, weather.name]);
        }
    };

    const handleSelectFavorite = (favoriteCity) => {
        setIsRangeOpen(false);
        setSearchTerm(favoriteCity);
        handleSearch({ cityName: favoriteCity }, days, units, locale);
    };

    const handleRemoveFavorite = (favoriteCity) => {
        setFavorites((prev) => prev.filter((storedCity) => storedCity !== favoriteCity));
    };

    const formatSuggestionLabel = (suggestion) => {
        return [suggestion.name, suggestion.state, suggestion.country].filter(Boolean).join(', ');
    };

    const handleSelectSuggestion = async (suggestion) => {
        const label = formatSuggestionLabel(suggestion);
        setSearchTerm(label);
        setSuggestions([]);
        await handleSearch(
            { cityName: label, coords: { lat: suggestion.lat, lon: suggestion.lon } },
            days,
            units,
            locale,
        );
    };

    const handleDetectLocation = () => {
        if (typeof window === 'undefined' || !window.navigator?.geolocation) {
            setError(translation.errors.locationUnsupported);
            return;
        }

        setIsLocating(true);
        setError('');

        window.navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                let detectedCity = '';

                try {
                    const resolvedCity = await fetchCityByCoordinates(latitude, longitude, undefined, locale);
                    if (resolvedCity) {
                        detectedCity = resolvedCity;
                        setSearchTerm(resolvedCity);
                    }
                } catch (geoLookupError) {
                    if (geoLookupError.name !== 'AbortError') {
                        console.error('Unable to resolve city from coordinates:', geoLookupError);
                    }
                }

                try {
                    await handleSearch(
                        { cityName: detectedCity, coords: { lat: latitude, lon: longitude } },
                        days,
                        units,
                        locale,
                    );
                } finally {
                    setIsLocating(false);
                }
            },
            (geoError) => {
                console.error('Geolocation error:', geoError);
                setError(translation.errors.locationFailed);
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
            },
        );
    };

    // Function to filter forecast data to one entry per day
    const getDailyForecast = (forecastList, daysToShow, targetLocale = locale) => {
        const dailyMap = new Map();
        const groupingLocale = localeFallbackMap[targetLocale] ?? localeFallbackMap.en;

        forecastList.forEach((item) => {
            const date = new Date(item.dt_txt).toLocaleDateString(groupingLocale);

            const hour = new Date(item.dt_txt).getHours();
            // Select the forecast closest to midday (12:00 PM)
            if (!dailyMap.has(date) || Math.abs(hour - 12) < Math.abs(new Date(dailyMap.get(date).dt_txt).getHours() - 12)) {
                dailyMap.set(date, item);
            }
        });

        // Limit the forecast to the requested number of days
        return Array.from(dailyMap.values())
            .sort((a, b) => new Date(a.dt_txt) - new Date(b.dt_txt))
            .slice(0, daysToShow);
    };

    const metrics = weather
        ? [
              { label: translation.metrics.wind, value: formatWindSpeed(weather.wind.speed) },
              {
                  label: translation.metrics.windGust,
                  value: weather.wind.gust ? formatWindSpeed(weather.wind.gust) : '—',
              },
              { label: translation.metrics.humidity, value: `${weather.main.humidity}%` },
              { label: translation.metrics.visibility, value: formatVisibility(weather.visibility) },
              { label: translation.metrics.pressure, value: `${weather.main.pressure} hPa` },
          ]
        : [];

    const timezoneOffset = additionalConditions?.timezone_offset ?? 0;
    const sunriseTime = formatTime(additionalConditions?.current?.sunrise, timezoneOffset);
    const sunsetTime = formatTime(additionalConditions?.current?.sunset, timezoneOffset);
    const uvIndex = additionalConditions?.current?.uvi;
    const solarInsights = [
        {
            label: translation.solar.sunrise,
            value: sunriseTime,
            icon: (
                <svg className="h-5 w-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v4m0 10v4m9-9h-4m-10 0H3m15.364 6.364-2.828-2.828M6.636 6.636 3.808 3.808M17.364 6.636l2.828-2.828M6.636 17.364l-2.828 2.828M7 15a5 5 0 0 1 10 0"
                    />
                </svg>
            ),
        },
        {
            label: translation.solar.sunset,
            value: sunsetTime,
            icon: (
                <svg className="h-5 w-5 text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v4m0 10v4m9-5h-4m-10 0H3m15.364 6.364-2.828-2.828M6.636 6.636 3.808 3.808M17.364 6.636l2.828-2.828M6.636 17.364l-2.828 2.828M7 15a5 5 0 0 1 10 0"
                    />
                </svg>
            ),
        },
        {
            label: translation.solar.uvIndex,
            value: uvIndex != null ? uvIndex.toFixed(1) : '—',
            icon: (
                <svg className="h-5 w-5 text-fuchsia-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 5.364-2.121-2.121M7.757 8.757 5.636 6.636m0 10.728 2.121-2.121m9.486-9.486 2.121-2.121M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
                    />
                </svg>
            ),
        },
    ];

    const isFavoriteSaved = weather?.name ? favorites.includes(weather.name) : false;

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-48 -left-24 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -bottom-56 -right-20 h-[28rem] w-[28rem] rounded-full bg-purple-500/30 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />
            </div>

            <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-6 py-16">
                <header className="max-w-3xl text-center">
                    <p className="text-sm font-medium uppercase tracking-[0.4em] text-cyan-300/80">
                        {translation.hero.tagline}
                    </p>
                    <h1 className="mt-4 text-balance text-4xl font-semibold md:text-6xl">{translation.hero.title}</h1>
                    <p className="mt-6 text-lg text-slate-300">{translation.hero.subtitle}</p>
                </header>

                <section className="mt-12 w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_-20px_rgba(56,189,248,0.8)] backdrop-blur-2xl">
                    <form className="flex flex-col gap-6" onSubmit={handleSearch}>
                        <div className="grid gap-4 md:grid-cols-[3fr,auto]">
                            <div className="relative">
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
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleSearch(event);
                                            }
                                        }}
                                        placeholder={translation.search.placeholder}
                                        className="w-full bg-transparent text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
                                        role="combobox"
                                        aria-autocomplete="list"
                                        aria-haspopup="listbox"
                                        aria-expanded={shouldShowSuggestionPanel || shouldShowEmptySuggestions}
                                        aria-controls="city-suggestion-list"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDetectLocation}
                                        disabled={isLocating}
                                        className="flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLocating ? (
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Zm0 0c3.866 0 7 2.239 7 5v2H5v-2c0-2.761 3.134-5 7-5Zm0 0v7" />
                                            </svg>
                                        )}
                                        <span className="hidden sm:inline">{translation.search.location}</span>
                                    </button>
                                </label>
                                {(shouldShowSuggestionPanel || shouldShowEmptySuggestions) && (
                                    <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_30px_60px_-25px_rgba(56,189,248,0.9)] backdrop-blur">
                                        <ul
                                            id="city-suggestion-list"
                                            role="listbox"
                                            aria-label={translation.search.suggestionsLabel}
                                            className="max-h-64 overflow-y-auto py-2"
                                        >
                                            {isSuggesting && suggestions.length === 0 ? (
                                                <li className="px-4 py-3 text-sm text-slate-300">{translation.search.suggestionsSearching}</li>
                                            ) : suggestions.length > 0 ? (
                                                suggestions.map((suggestion) => {
                                                    const label = formatSuggestionLabel(suggestion);
                                                    return (
                                                        <li key={`${suggestion.lat}-${suggestion.lon}`}>
                                                            <button
                                                                type="button"
                                                                role="option"
                                                                aria-selected="false"
                                                                onMouseDown={(event) => event.preventDefault()}
                                                                onClick={() => handleSelectSuggestion(suggestion)}
                                                                className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                                                            >
                                                                <span className="font-semibold text-slate-100">{label}</span>
                                                                <span className="text-xs text-slate-400">{translation.search.suggestionAction}</span>
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <li className="px-4 py-3 text-sm text-slate-300">
                                                    <span className="block">{translation.search.suggestionsEmpty}</span>
                                                    <span className="block text-xs text-slate-500">{translation.search.suggestionsEmptyHint}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:translate-y-[-2px] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
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
                                {isLoading ? translation.search.buttonLoading : translation.search.buttonIdle}
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-[1.6fr,1fr]">
                            <div
                                ref={rangeRef}
                                className="group relative rounded-2xl bg-slate-900/60 px-5 py-4 ring-1 ring-white/5 transition focus-within:ring-2 focus-within:ring-cyan-400/60"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">{translation.range.label}</p>
                                        <p className="mt-1 text-sm text-slate-300/90">{translation.search.helper}</p>
                                    </div>
                                    <div className="relative w-full max-w-[12rem]">
                                        <button
                                            type="button"
                                            onClick={() => setIsRangeOpen((prev) => !prev)}
                                            aria-haspopup="listbox"
                                            aria-expanded={isRangeOpen}
                                            className="flex w-full flex-col rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-left text-sm font-semibold text-slate-100 shadow-[0_10px_30px_-18px_rgba(56,189,248,0.8)] transition hover:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                        >
                                            <span>{selectedRange.title}</span>
                                            <span className="text-xs font-normal text-slate-400">{selectedRange.description}</span>
                                        </button>
                                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-cyan-200/70 transition group-focus-within:text-cyan-200">
                                            <svg className={`h-4 w-4 transition ${isRangeOpen ? 'rotate-180 text-cyan-200' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.084l3.71-3.854a.75.75 0 0 1 1.08 1.04l-4.25 4.41a.75.75 0 0 1-1.08 0l-4.25-4.41a.75.75 0 0 1 .02-1.06Z" />
                                            </svg>
                                        </span>

                                        {isRangeOpen && (
                                            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_30px_60px_-25px_rgba(56,189,248,0.9)] backdrop-blur">
                                                <ul role="listbox" aria-label={translation.range.label} className="max-h-64 overflow-y-auto py-2">
                                                    {localizedDayOptions.map((option) => {
                                                        const isSelected = option.value === days;

                                                        return (
                                                            <li key={option.value}>
                                                                <button
                                                                    type="button"
                                                                    role="option"
                                                                    aria-selected={isSelected}
                                                                    onClick={() => handleRangeSelect(option.value)}
                                                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                                                                        isSelected ? 'bg-white/10 text-cyan-200' : 'text-slate-200 hover:bg-white/5'
                                                                    }`}
                                                                >
                                                                    <span
                                                                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                                                                            isSelected ? 'bg-cyan-300 shadow-[0_0_0_4px_rgba(8,145,178,0.25)]' : 'bg-slate-700'
                                                                        }`}
                                                                    />
                                                                    <span className="flex flex-col">
                                                                        <span className="font-semibold">{option.title}</span>
                                                                        <span className="text-xs text-slate-400">{option.description}</span>
                                                                    </span>
                                                                    {isSelected && (
                                                                        <span className="ml-auto flex items-center text-cyan-200">
                                                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M16.704 5.29a.997.997 0 0 1 0 1.41l-7.42 7.42a1 1 0 0 1-1.414 0l-3.17-3.17a1 1 0 0 1 1.414-1.414l2.463 2.463 6.713-6.713a.997.997 0 0 1 1.414 0Z"
                                                                                />
                                                                            </svg>
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{translation.units.label}</p>
                                        <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-950/60 p-1 ring-1 ring-white/10">
                                            <button
                                                type="button"
                                                onClick={() => handleUnitsChange('metric')}
                                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                                                    units === 'metric'
                                                        ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_10px_30px_-18px_rgba(56,189,248,0.9)]'
                                                        : 'text-slate-300 hover:text-cyan-200'
                                                }`}
                                            >
                                                {translation.units.metric}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUnitsChange('imperial')}
                                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                                                    units === 'imperial'
                                                        ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_10px_30px_-18px_rgba(56,189,248,0.9)]'
                                                        : 'text-slate-300 hover:text-cyan-200'
                                                }`}
                                            >
                                                {translation.units.imperial}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{translation.language.label}</p>
                                        <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-950/60 p-1 ring-1 ring-white/10">
                                            {languageOptions.map((option) => {
                                                const isActive = option === locale;
                                                return (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleLocaleChange(option)}
                                                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                                                            isActive
                                                                ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_10px_30px_-18px_rgba(56,189,248,0.9)]'
                                                                : 'text-slate-300 hover:text-cyan-200'
                                                        }`}
                                                    >
                                                        {translation.language.options[option]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveFavorite}
                                    disabled={!weather || isFavoriteSaved}
                                    className={`flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                                        !weather || isFavoriteSaved
                                            ? 'cursor-not-allowed bg-slate-800/60 text-slate-500'
                                            : 'bg-slate-800/80 text-slate-100 hover:text-cyan-200'
                                    }`}
                                >
                                    <svg
                                        className={`h-4 w-4 ${isFavoriteSaved ? 'text-amber-300' : 'text-cyan-200'}`}
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 3.75 9.347 9.51l-6.01.558 4.547 4.07-1.336 5.956L12 16.98l5.452 3.114-1.336-5.956 4.547-4.07-6.01-.558z" />
                                    </svg>
                                    {isFavoriteSaved ? translation.favorites.buttonSaved : translation.favorites.button}
                                </button>
                            </div>
                        </div>

                        {favorites.length > 0 && (
                            <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{translation.favorites.quickPicks}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {favorites.map((favoriteCity) => (
                                        <div
                                            key={favoriteCity}
                                            className="flex items-center gap-1 rounded-full bg-slate-950/70 pl-1 pr-1.5 text-sm text-slate-200 ring-1 ring-white/10"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleSelectFavorite(favoriteCity)}
                                                className="flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                                            >
                                                <svg className="h-4 w-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c-4 0-6 2-6 6m6-6c4 0 6 2 6 6" />
                                                </svg>
                                                <span>{favoriteCity}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFavorite(favoriteCity)}
                                                aria-label={formatMessage(translation.favorites.removeAria, { city: favoriteCity })}
                                                className="rounded-full p-1.5 text-slate-400 transition hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
                                            >
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && <p className="mt-2 text-sm text-red-300/90">{error}</p>}
                    </form>
                </section>

                {weather && (
                    <section className="mt-12 w-full max-w-5xl">
                        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
                            <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 p-8 shadow-[0_0_50px_-20px_rgba(168,85,247,0.7)]">
                                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">{translation.currentPanel.tag}</p>
                                            <h2 className="mt-3 text-4xl font-semibold text-white">{weather.name}</h2>
                                            <p className="mt-1 text-sm text-slate-300">
                                                {new Date().toLocaleDateString(dateLocale, {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-cyan-200/80">
                                            <svg className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15Z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-wrap items-center gap-8">
                                        <div className="text-6xl font-semibold md:text-7xl">{formatTemperature(weather.main.temp)}</div>
                                        <div className="space-y-2 text-slate-200">
                                            <p className="text-xl font-medium capitalize">{weather.weather[0].description}</p>
                                            <p className="text-sm text-slate-300">
                                                {formatMessage(translation.currentPanel.feelsLike, {
                                                    feelsLike: formatTemperature(weather.main.feels_like),
                                                    high: formatTemperature(weather.main.temp_max),
                                                    low: formatTemperature(weather.main.temp_min),
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
                                        {solarInsights.map((insight) => (
                                            <div
                                                key={insight.label}
                                                className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/60">
                                                    {insight.icon}
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{insight.label}</p>
                                                    <p className="mt-1 text-sm font-semibold text-white">{insight.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <aside className="grid gap-4 sm:grid-cols-2">
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
                            <h3 className="text-xl font-semibold text-white">{translation.forecast.heading}</h3>
                            <span className="text-sm text-slate-300">
                                {formatMessage(translation.forecast.summary, { count: forecast.length })}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {forecast.map((day, index) => {
                                const precipitationChance = formatPrecipProbability(day.pop);
                                const gustDisplay = formatWindSpeed(day.wind?.gust ?? day.wind?.speed);
                                const baseWind = formatMessage(translation.forecast.wind, {
                                    speed: formatWindSpeed(day.wind?.speed),
                                });
                                const gustText = day.wind?.gust
                                    ? formatMessage(translation.forecast.gusts, { gust: gustDisplay })
                                    : baseWind;

                                return (
                                    <div
                                        key={`${day.dt_txt}-${index}`}
                                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_15px_60px_-30px_rgba(147,51,234,0.7)] transition-transform hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                                        <p className="text-sm text-slate-300">
                                            {new Date(day.dt_txt).toLocaleDateString(dateLocale, {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <div className="mt-6 flex items-end justify-between">
                                            <div>
                                                <p className="text-4xl font-semibold text-white">{formatTemperature(day.main.temp)}</p>
                                                <p className="mt-1 text-base capitalize text-slate-300">{day.weather[0].description}</p>
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {formatMessage(translation.forecast.highLow, {
                                                        high: formatTemperature(day.main.temp_max),
                                                        low: formatTemperature(day.main.temp_min),
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-cyan-200/80">
                                                <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 0 0 4 4h9a5 5 0 1 0-.1-9.999 5.002 5.002 0 0 0-9.78 2.096A4.001 4.001 0 0 0 3 15Z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-2 text-xs text-slate-300">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="h-4 w-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m6.364 1.636-2.121 2.121M21 12h-3m-1.636 6.364-2.121-2.121M12 21v-3m-6.364-1.636 2.121-2.121M3 12h3m1.636-6.364 2.121 2.121" />
                                                    </svg>
                                                    {formatMessage(translation.forecast.precip, { chance: precipitationChance })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="h-4 w-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-7-7 7 7-7 7" />
                                                    </svg>
                                                    {gustText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
