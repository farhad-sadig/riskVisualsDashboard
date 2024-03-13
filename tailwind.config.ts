const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {}
	},
	darkMode: "class",
	plugins: [
		nextui({
			prefix: "nextui",
			addCommonColors: true,
			defaultTheme: "light",
			defaultExtendTheme: "light",
			layout: {
				spacingUnit: 4, // in px
				disabledOpacity: 0.5, // this value is applied as opacity-[value] when the component is disabled
				dividerWeight: "1px", // h-divider the default height applied to the divider component
				fontSize: {
					tiny: "0.75rem", // text-tiny
					small: "0.875rem", // text-small
					medium: "1rem", // text-medium
					large: "1.125rem" // text-large
				},
				lineHeight: {
					tiny: "1rem", // text-tiny
					small: "1.25rem", // text-small
					medium: "1.5rem", // text-medium
					large: "1.75rem" // text-large
				},
				radius: {
					small: "8px", // rounded-small
					medium: "12px", // rounded-medium
					large: "14px" // rounded-large
				},
				borderWidth: {
					small: "1px", // border-small
					medium: "2px", // border-medium (default)
					large: "3px" // border-large
				}
			},
			themes: {
				light: {
					colors: {
						background: "#082f49",
						foreground: "#075985",
						focus: "#0284c7",
						primary: {
							50: "#f0f9ff",
							100: "#e0f2fe",
							200: "#bae6fd",
							300: "#7dd3fc",
							400: "#38bdf8",
							500: "#0ea5e9",
							600: "#0284c7",
							700: "#0369a1",
							800: "#075985",
							900: "#0c4a6e",
							950: "#082f49",
							DEFAULT: "#38bdf8",
							foreground: "#075985"
						}
					}
				},
				modLight: {
					colors: {
						foreground: "#f1f5f9"
					}
				}
			}
		})
	]
};
