/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        danger: "hsl(var(--danger))",
        warning: "hsl(var(--warning))",
        safe: "hsl(var(--safe))",
      },
      boxShadow: {
        soft: "0 20px 50px -20px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 10% 20%, rgba(16,185,129,0.16) 0%, transparent 30%), radial-gradient(circle at 90% 0%, rgba(20,184,166,0.15) 0%, transparent 35%)",
      },
    },
  },
  plugins: [],
};
