/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        input: "var(--input-color)",
        primary: "var(--color-text-primary)",
        secondary: "var(--color-text-secondary)",
        inputHover: "var(--input-color-hover)",
      },

      backgroundColor: {
        primary: "var(--color-bg-primary)",
        secondary: "var(--color-bg-secondary)",
        primaryHover: "var(--color-bg-hover-primary)",
        secondaryHover: "var(--color-bg-hover-secondary)",
        primaryActive: "var(--color-bg-active-primary)",
        secondaryActive: "var(--color-bg-active-secondary)",
        navbar: "var(--color-bg-navbar)",
        btnSelected: "var(--color-bg-btn-selected)"
      },

      hover: {
        primary: "var(--color-bg-hover-primary)",
        secondary: "var(--color-bg-hover-secondary)",
      },

      active: {
        primary: "var(--color-bg-active-primary)",
        secondary: "var(--color-bg-active-secondary)"
      },

      borderColor: {
        input: "var(--input-border)",
        primary: "var(--color-border-primary)",
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

