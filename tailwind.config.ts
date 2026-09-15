import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#eef3f2",
        ink: "#102228",
        mist: "#dce7e4",
        line: "#b7c6c2",
        accent: "#355c5a",
        accentSoft: "#608783",
        gold: "#b09a63"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(15, 34, 40, 0.14)"
      },
      backgroundImage: {
        "time-flow": "radial-gradient(circle at 20% 20%, rgba(176,154,99,0.16), transparent 22%), radial-gradient(circle at 70% 15%, rgba(96,135,131,0.14), transparent 24%), linear-gradient(140deg, rgba(255,255,255,0.92), rgba(238,243,242,0.95))"
      }
    }
  },
  plugins: []
};

export default config;
