import { useState, useEffect, useCallback } from 'react'
import './App.css'

// ---- Weather code -> label / icon / mood mapping (WMO codes via Open-Meteo) ----
const WEATHER_MAP = {
  0: { label: 'Clear sky', icon: 'sun', mood: 'clear' },
  1: { label: 'Mostly clear', icon: 'sun-cloud', mood: 'clear' },
  2: { label: 'Partly cloudy', icon: 'sun-cloud', mood: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloud', mood: 'cloudy' },
  45: { label: 'Fog', icon: 'fog', mood: 'fog' },
  48: { label: 'Icy fog', icon: 'fog', mood: 'fog' },
  51: { label: 'Light drizzle', icon: 'rain', mood: 'rain' },
  53: { label: 'Drizzle', icon: 'rain', mood: 'rain' },
  55: { label: 'Heavy drizzle', icon: 'rain', mood: 'rain' },
  56: { label: 'Freezing drizzle', icon: 'rain', mood: 'rain' },
  57: { label: 'Freezing drizzle', icon: 'rain', mood: 'rain' },
  61: { label: 'Light rain', icon: 'rain', mood: 'rain' },
  63: { label: 'Rain', icon: 'rain', mood: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain', mood: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain', mood: 'rain' },
  67: { label: 'Freezing rain', icon: 'rain', mood: 'rain' },
  71: { label: 'Light snow', icon: 'snow', mood: 'snow' },
  73: { label: 'Snow', icon: 'snow', mood: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow', mood: 'snow' },
  77: { label: 'Snow grains', icon: 'snow', mood: 'snow' },
  80: { label: 'Rain showers', icon: 'rain', mood: 'rain' },
  81: { label: 'Rain showers', icon: 'rain', mood: 'rain' },
  82: { label: 'Violent showers', icon: 'rain', mood: 'rain' },
  85: { label: 'Snow showers', icon: 'snow', mood: 'snow' },
  86: { label: 'Snow showers', icon: 'snow', mood: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm', mood: 'storm' },
  96: { label: 'Thunderstorm w/ hail', icon: 'storm', mood: 'storm' },
  99: { label: 'Thunderstorm w/ hail', icon: 'storm', mood: 'storm' },
}

const getWeatherInfo = (code) => WEATHER_MAP[code] || { label: 'Unknown', icon: 'cloud', mood: 'cloudy' }

// ---- Hand-drawn line icons ----
function WeatherIcon({ type, size = 64 }) {
  const stroke = 'currentColor'
  const common = { fill: 'none', stroke, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <circle cx="32" cy="32" r="12" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="32" y1="6" x2="32" y2="14" transform={`rotate(${a} 32 32)`} />
          ))}
        </svg>
      )
    case 'sun-cloud':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <circle cx="24" cy="24" r="9" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line key={a} x1="24" y1="6" x2="24" y2="11" transform={`rotate(${a} 24 24)`} />
          ))}
          <path d="M20 44a10 10 0 0 1 1-20 12 12 0 0 1 23 4 9 9 0 0 1-2 18H22" />
        </svg>
      )
    case 'cloud':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <path d="M18 42a11 11 0 0 1 1-22 13 13 0 0 1 25 4 10 10 0 0 1-2 20H20" />
        </svg>
      )
    case 'fog':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <path d="M18 26a11 11 0 0 1 1-14 13 13 0 0 1 25 4 10 10 0 0 1-2 12H20" />
          <line x1="12" y1="42" x2="52" y2="42" />
          <line x1="16" y1="50" x2="48" y2="50" />
        </svg>
      )
    case 'rain':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <path d="M18 32a11 11 0 0 1 1-20 13 13 0 0 1 25 4 10 10 0 0 1-2 18H20" />
          <line x1="24" y1="42" x2="21" y2="52" />
          <line x1="34" y1="42" x2="31" y2="52" />
          <line x1="44" y1="42" x2="41" y2="52" />
        </svg>
      )
    case 'snow':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <path d="M18 30a11 11 0 0 1 1-20 13 13 0 0 1 25 4 10 10 0 0 1-2 18H20" />
          <g strokeWidth="1.4">
            <line x1="24" y1="44" x2="24" y2="54" />
            <line x1="19" y1="49" x2="29" y2="49" />
            <line x1="42" y1="44" x2="42" y2="54" />
            <line x1="37" y1="49" x2="47" y2="49" />
          </g>
        </svg>
      )
    case 'storm':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" {...common}>
          <path d="M18 28a11 11 0 0 1 1-20 13 13 0 0 1 25 4 10 10 0 0 1-2 18H20" />
          <path d="M30 40l-6 10h8l-5 10" strokeWidth="1.8" />
        </svg>
      )
    default:
      return null
  }
}

// ---- Background mood -> gradient tokens ----
const MOOD_GRADIENT = {
  clear: 'linear-gradient(160deg, #1A1F2E 0%, #14182A 55%, #0A0C14 100%)',
  cloudy: 'linear-gradient(160deg, #1C222E 0%, #151A24 55%, #0A0C12 100%)',
  rain: 'linear-gradient(160deg, #131B28 0%, #0F1620 55%, #080B10 100%)',
  snow: 'linear-gradient(160deg, #1A222C 0%, #131A22 55%, #090C10 100%)',
  fog: 'linear-gradient(160deg, #1C1F26 0%, #15171D 55%, #0A0B0E 100%)',
  storm: 'linear-gradient(160deg, #15141F 0%, #100F18 55%, #08070C 100%)',
}

function App() {
  const [query, setQuery] = useState('')
  const [place, setPlace] = useState(null)
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchWeatherFor = useCallback(async (lat, lon, label) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=1`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Forecast request failed')
      const data = await res.json()
      setWeather(data)
      setPlace((p) => (label ? { ...p, name: label } : p))
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Could not load weather. Please try again.')
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      const geoRes = await fetch(geoUrl)
      const geoData = await geoRes.json()
      if (!geoData.results || geoData.results.length === 0) {
        setStatus('error')
        setErrorMsg(`No city found named "${query}".`)
        return
      }
      const { latitude, longitude, name, country } = geoData.results[0]
      setPlace({ name, country, latitude, longitude })
      await fetchWeatherFor(latitude, longitude, name)
    } catch (err) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMsg('Location access is not available on this device.')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setPlace({ name: 'Your location', country: '', latitude, longitude })
        await fetchWeatherFor(latitude, longitude, 'Your location')
      },
      () => {
        setStatus('error')
        setErrorMsg('Location permission was denied.')
      }
    )
  }

  useEffect(() => {
    setPlace({ name: 'Lahore', country: 'Pakistan', latitude: 31.5497, longitude: 74.3436 })
    fetchWeatherFor(31.5497, 74.3436, 'Lahore')
  }, [fetchWeatherFor])

  const info = weather ? getWeatherInfo(weather.current.weather_code) : null
  const mood = info ? info.mood : 'clear'
  const background = MOOD_GRADIENT[mood]

  return (
    <div className="app" style={{ background }}>
      <div className="app__inner">
        <header className="app__header">
          <span className="app__eyebrow">SkyCast </span>
          <form className="search" onSubmit={handleSearch}>
            <input
              className="search__input"
              type="text"
              placeholder="Search a city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search city"
            />
            <button className="search__btn" type="submit" aria-label="Search">
              →
            </button>
          </form>
          <button className="link-btn" onClick={useMyLocation} type="button">
            Use my location
          </button>
        </header>

        {status === 'loading' && <p className="status">Reading the sky…</p>}
        {status === 'error' && <p className="status status--error">{errorMsg}</p>}

        {status === 'ready' && weather && (
          <main className="card">
            <div className="card__place">
              <h1>{place?.name}</h1>
              {place?.country && <span>{place.country}</span>}
            </div>

            <div className="card__hero">
              <WeatherIcon type={info.icon} size={96} />
              <div className="card__temp">{Math.round(weather.current.temperature_2m)}°</div>
            </div>

            <p className="card__condition">{info.label}</p>
            <p className="card__feels">
              Feels like {Math.round(weather.current.apparent_temperature)}° · H{' '}
              {Math.round(weather.daily.temperature_2m_max[0])}° L {Math.round(weather.daily.temperature_2m_min[0])}°
            </p>

            <div className="card__grid">
              <div className="stat">
                <span className="stat__label">Humidity</span>
                <span className="stat__value">{weather.current.relative_humidity_2m}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Wind</span>
                <span className="stat__value">{Math.round(weather.current.wind_speed_10m)} km/h</span>
              </div>
              <div className="stat">
                <span className="stat__label">Sunrise</span>
                <span className="stat__value">
                  {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="stat">
                <span className="stat__label">Sunset</span>
                <span className="stat__value">
                  {new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="hourly">
              {weather.hourly.time.slice(0, 8).map((t, i) => {
                const hInfo = getWeatherInfo(weather.hourly.weather_code[i])
                return (
                  <div className="hourly__item" key={t}>
                    <span className="hourly__time">
                      {new Date(t).toLocaleTimeString([], { hour: 'numeric' })}
                    </span>
                    <WeatherIcon type={hInfo.icon} size={28} />
                    <span className="hourly__temp">{Math.round(weather.hourly.temperature_2m[i])}°</span>
                  </div>
                )
              })}
            </div>
          </main>
        )}

        <footer className="app__footer">Data from Open‑Meteo</footer>
      </div>
    </div>
  )
}

export default App