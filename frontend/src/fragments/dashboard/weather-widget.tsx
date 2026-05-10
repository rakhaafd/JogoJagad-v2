import { CloudRain, Droplets, Wind } from "lucide-react";
import { weatherInfo } from "../../services/mock-data";
import { Card } from "../../components/ui/card";

export function WeatherWidget() {
  return (
    <Card glass>
      <p className="text-sm text-muted-foreground">{weatherInfo.city}</p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <h3 className="text-4xl font-semibold">{weatherInfo.temperature}°C</h3>
          <p className="text-sm text-muted-foreground">{weatherInfo.condition}</p>
        </div>
        <CloudRain className="h-10 w-10 text-primary" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <Droplets className="h-4 w-4" /> Humidity {weatherInfo.humidity}%
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Wind className="h-4 w-4" /> Wind {weatherInfo.windSpeed} km/h
        </p>
      </div>
    </Card>
  );
}
