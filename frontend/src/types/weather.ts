export interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
}

export interface OpenWeatherWind {
  speed: number;
}

export interface OpenWeatherCondition {
  main: string;
  description: string;
}

export interface WeatherApiData {
  weather: OpenWeatherCondition[];
  main: OpenWeatherMain;
  wind: OpenWeatherWind;
}

export interface CurrentWeatherResponse {
  city: string;
  weather: WeatherApiData;
}
