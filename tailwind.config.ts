module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green": "#00e696",
        "neon-cyan": "#00b4d8",
        "dark-bg": "#0a0a0a",
      },
      animation: {
        float: "float 12s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(100px, 100px)" },
          "50%": { transform: "translate(-50px, 150px)" },
          "75%": { transform: "translate(-100px, -50px)" },
        },
      },
    },
  },
  plugins: [],
};