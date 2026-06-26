export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryDark: "#4C1D95",
        primary: "#6D28D9",
        primaryLight: "#A78BFA",
        dark: "#0F0A1F",
        card: "#1A1333",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        hackathon: {
          primary: "#6D28D9",
          secondary: "#A78BFA",
          accent: "#8B5CF6",
          neutral: "#1A1333",
          "base-100": "#0F0A1F",
          info: "#38BDF8",
          success: "#22C55E",
          warning: "#FACC15",
          error: "#EF4444",
        },
      },
    ],
  },
};