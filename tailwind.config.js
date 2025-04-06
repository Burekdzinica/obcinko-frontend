/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        winGreen: "#00be00",
        backdropDim: "var(--backdrop-dim)",
        txt: "var(--text-color)",
        modal: "var(--modal-bg-color)",
        navbar: "var(--bg-navbar)",
        hover: "var(--hover-color)",
        active: "var(--active-color)",
        map: " var(--map-container-bg-color)",
      },

      padding: {
        modal: "var(--modal-padding)",
      },

      animation: {
        "fadeIn": "fadeIn 0.5s ease-in-out",
        "fadeSlideDown": "fadeSlideDown 0.15s ease-in-out", 
        "shake": "shake 0.5s ease",
      },

      keyframes: {
        fadeIn: {
          "0%": { 
              opacity: "0",
              transform: "translateY(-50px)",
          },
          "100%": { 
              opacity: "1",
              transform: "translateY(0)", 
          },
        },

        fadeSlideDown: {
          from: {
              opacity: "0",
              transform: "translate(-50%, -70%)",
          },
          to: {
              opacity: "1",
              transform: "translate(-50%, -50%)",
          },
        },

        shake: {
          "0%": { 
              transform: "translate(-50%, -50%) translateX(0)", 
          },
          "25%": { 
              transform: "translate(-50%, -50%) translateX(-5px)", 
          },
          "50%": { 
              transform: "translate(-50%, -50%) translateX(5px)", 
          },
          "75%": { 
              transform: "translate(-50%, -50%) translateX(-5px)", 
          },
          "100%": { 
              transform: "translate(-50%, -50%) translateX(0)",
          },
        },
      },
    },
  },
  plugins: [],
}

