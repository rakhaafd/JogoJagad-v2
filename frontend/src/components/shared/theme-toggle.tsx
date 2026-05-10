import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
