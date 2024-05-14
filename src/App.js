import React, { useState, useEffect } from 'react';
import { SearchIcon, SunIcon, CloudIcon } from '@heroicons/react/solid';
import './App.css';

function App() {
  const [temp, setTemp] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [city, setCity] = useState('');
  const [isReady, setReady] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    if (!latitude || !longitude) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
      .then(result => result.json())
      .then(jsonresult => {
        setTemp(jsonresult.main.temp);
        setDesc(jsonresult.weather[0].main);
        setIcon(jsonresult.weather[0].icon);
        setSunrise(new Date(jsonresult.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(jsonresult.sys.sunset * 1000).toLocaleTimeString());
        setCity(jsonresult.name);
        setReady(true);
      })
      .catch(err => console.error(err));
  }, [latitude, longitude, apiKey]);

  useEffect(() => {
    if (!searchCity) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`)
      .then(result => result.json())
      .then(jsonresult => {
        setTemp(jsonresult.main.temp);
        setDesc(jsonresult.weather[0].main);
        setIcon(jsonresult.weather[0].icon);
        setSunrise(new Date(jsonresult.sys.sunrise * 1000).toLocaleTimeString());
        setSunset(new Date(jsonresult.sys.sunset * 1000).toLocaleTimeString());
        setCity(jsonresult.name);
        setReady(true);
      })
      .catch(err => console.error(err));
  }, [searchCity, apiKey]);

  const handleLatitudeChange = (event) => {
    setLatitude(event.target.value);
  };

  const handleLongitudeChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleSearchCityChange = (event) => {
    setSearchCity(event.target.value);
  };

  const getBackgroundClass = () => {
    if (desc.includes('Clear')) {
      return 'bg-blue-500 text-white';
    } else if (desc.includes('Clouds')) {
      if (temp < 15) {
        return 'bg-gray-300 text-gray-800';
      } else if (temp < 25) {
        return 'bg-gray-500 text-white';
      } else {
        return 'bg-gray-700 text-white';
      }
    } else if (desc.includes('Rain')) {
      return 'bg-blue-800 text-white';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeOfDay = () => {
    const now = new Date();
    const sunriseTime = new Date(sunrise).getHours();
    const sunsetTime = new Date(sunset).getHours();
    const currentHour = now.getHours();

    if (currentHour >= sunriseTime && currentHour < sunsetTime) {
      return 'day';
    } else {
      return 'night';
    }
  };

  const backgroundClass = `${getBackgroundClass()} ${getTimeOfDay() === 'day' ? 'bg-opacity-75' : 'bg-opacity-50'}`;

  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 text-white p-8 rounded-lg shadow-md">
        <h1 className="text-center text-5xl font-extrabold">My Weather App</h1>
      </div>
      <div className="flex flex-wrap mt-10">
        <div className="w-full lg:w-1/2 mb-8">
          <div className={`weather-data p-6 rounded-lg shadow-lg ${backgroundClass}`}>
            <h2 className="text-2xl mb-6 font-semibold">Weather Data</h2>
            {isReady ? (
              <div className="p-6 rounded-lg">
                <h4 className="font-bold text-xl">City: {city}</h4>
                <p className="mt-4 text-lg">Temperature: {temp} °C</p>
                <p className="text-lg">Main: {desc}</p>
                <p className="text-lg">Description: {desc}</p>
                <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather icon" className="mt-4 mb-4" />
                <p className="text-lg">Sunrise: {sunrise}</p>
                <p className="text-lg">Sunset: {sunset}</p>
              </div>
            ) : (
              <div className="text-center text-lg">Loading...</div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2 mb-8">
          <div className="search-form p-6 rounded-lg shadow-lg bg-white">
            <h2 className="text-gray-700 text-2xl mb-6 font-semibold">Search by City</h2>
            <div className="mb-6">
              <label htmlFor="searchCity" className="block text-gray-600 text-lg">City:</label>
              <div className="relative mt-2">
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring focus:ring-blue-200" id="searchCity" value={searchCity} onChange={handleSearchCityChange} placeholder="Enter city name" />
                <SearchIcon className="h-6 w-6 text-gray-500 absolute right-4 top-3" />
              </div>
            </div>
            <h2 className="text-gray-700 text-2xl mb-6 font-semibold">Enter Coordinates</h2>
            <div className="mb-6">
              <label htmlFor="latitude" className="block text-gray-600 text-lg">Latitude:</label>
              <div className="relative mt-2">
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring focus:ring-blue-200" id="latitude" value={latitude} onChange={handleLatitudeChange} placeholder="Enter latitude" />
                <SunIcon className="h-6 w-6 text-gray-500 absolute right-4 top-3" />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="longitude" className="block text-gray-600 text-lg">Longitude:</label>
              <div className="relative mt-2">
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:ring focus:ring-blue-200" id="longitude" value={longitude} onChange={handleLongitudeChange} placeholder="Enter longitude" />
                <CloudIcon className="h-6 w-6 text-gray-500 absolute right-4 top-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
