export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#111111",
        border: "#1f1f1f",
        accent: "#00ff88",
        cyan: "#00ccff",
        gold: "#f0c040",
        textPrimary: "#ffffff",
        textSecondary: "#888888"
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      }
    }
  },
  plugins: []
}
