import { CloudRain, Droplets, Wind } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useApi } from "../../composables/useApi";
import { weatherService } from "../../services/weatherService";

export function WeatherWidget() {
  const { data, loading, error } = useApi(weatherService.current);
  const weather = data?.weather;
  const mainCondition = weather?.weather?.[0]?.main ?? "Unknown";
  // OpenWeatherMap returns temperature in Kelvin by default — convert to °C
  const tempKelvin = weather?.main?.temp ?? 0;
  const tempCelsius = Math.round(tempKelvin - 273.15);

  return (
    <Card glass>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : data ? (
        <>
          <p className="text-sm text-muted-foreground">{data.city}</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h3 className="text-4xl font-semibold">{tempCelsius}°C</h3>
              <p className="text-sm text-muted-foreground">{mainCondition}</p>
            </div>
            <CloudRain className="h-10 w-10 text-primary" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4" /> Humidity{" "}
              {weather?.main?.humidity ?? 0}%
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Wind className="h-4 w-4" /> Wind {weather?.wind?.speed ?? 0} km/h
            </p>
          </div>
        </>
      ) : null}
    </Card>
  );
}
