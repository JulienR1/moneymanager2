const plugin = require("tailwindcss/plugin");
const defaultColors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        ...defaultTheme.fontSize,
        xxs: "0.6rem",
      },
      fontFamily: {
        noto: ['"Noto Sans"'],
      },
      animation: {
        shake: "shake 100ms ease-in-out forwards",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "33%": { transform: "translateX(-2px)" },
          "66%": { transform: "translateX(2px)" },
        },
      },
    },
    colors: {
      primary: "#7966ff",
      "primary-dark": "#614dff",
      secondary: "#9666ff",
      ...defaultColors,
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("group-hocus", [
        ":merge(.group):hover &",
        ":merge(.group):focus &",
      ]);
    }),
  ],
};
