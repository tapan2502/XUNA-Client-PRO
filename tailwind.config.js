import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.{ts,tsx}"
	],
	theme: {
		extend: {
			colors: {
				xunaBlack: "#0B0B0B",
				xunaBlackSecondary: "#0D0D0D"
			},
			margin: {'-80': '-25rem'},
			// spacing: {
			// 	"1": "0.3125rem",   // 5px
			// 	"2": "0.625rem",    // 10px
			// 	"3": "0.9375rem",   // 15px
			// 	"4": "1.25rem",     // 20px
			// 	"5": "1.5625rem",   // 25px
			// 	"6": "1.875rem",    // 30px
			// 	"7": "2.1875rem",   // 35px
			// 	"8": "2.5rem",      // 40px
			// 	"9": "2.8125rem",   // 45px
			// 	"10": "3.125rem",   // 50px
			// 	"11": "3.4375rem",  // 55px
			// 	"12": "3.75rem",    // 60px
			// 	"13": "4rem",  		// 65px
			// 	"14": "4.375rem",   // 70px4
			// 	"15": "4.6875rem",  // 75px
			// 	"16": "5rem",       // 80px
			// 	"17": "5.3125rem",  // 85px
			// 	"18": "5.625rem",   // 90px
			// 	"19": "5.9375rem",  // 95px
			// 	"20": "6.25rem",    // 100px
			// 	"21": "6.5625rem",  // 105px
			// 	"22": "6.875rem",   // 110px
			// 	"23": "7.1875rem",  // 115px
			// 	"24": "7.5rem",     // 120px
			// 	"25": "7.8125rem",  // 125px
			// 	"26": "8.125rem",   // 130px
			// 	"27": "8.4375rem",  // 135px
			// 	"28": "8.75rem",    // 140px
			// 	"29": "9.0625rem",  // 145px
			// 	"30": "9.375rem",    // 150px
			// 	"31": "9.6875rem",   // 155px
			// 	"32": "10rem",       // 160px
			// 	"33": "10.3125rem",  // 165px
			// 	"34": "10.625rem",   // 170px
			// 	"35": "10.9375rem",  // 175px
			// 	"36": "11.25rem",    // 180px
			// 	"37": "11.5625rem",  // 185px
			// 	"38": "11.875rem",   // 190px
			// 	"39": "12.1875rem",  // 195px
			// 	"40": "12.5rem",     // 200px
			// 	"41": "12.8125rem",  // 205px
			// 	"42": "13.125rem",   // 210px
			// 	"43": "13.4375rem",  // 215px
			// 	"44": "13.75rem",    // 220px
			// 	"45": "14.0625rem",  // 225px
			// 	"46": "14.375rem",   // 230px
			// 	"47": "14.6875rem",  // 235px
			// 	"48": "15rem",       // 240px
			// 	"49": "15.3125rem",  // 245px
			// 	"50": "15.625rem",   // 250px
			// 	"51": "15.9375rem",  // 255px
			// 	"52": "16.25rem",    // 260px
			// 	"53": "16.5625rem",  // 265px
			// 	"54": "16.875rem",   // 270px
			// 	"55": "17.1875rem",  // 275px
			// 	"56": "17.5rem",     // 280px
			// 	"57": "17.8125rem",  // 285px
			// 	"58": "18.125rem",   // 290px
			// 	"59": "18.4375rem",  // 295px
			// 	"60": "18.75rem",    // 300px
			// 	"61": "19.0625rem",  // 305px
			// 	"62": "19.375rem",   // 310px
			// 	"63": "19.6875rem",  // 315px
			// 	"64": "20rem",       // 320px
			// 	"65": "20.3125rem",  // 325px
			// 	"66": "20.625rem",   // 330px
			// 	"67": "20.9375rem",  // 335px
			// 	"68": "21.25rem",    // 340px
			// 	"69": "21.5625rem",  // 345px
			// 	"70": "21.875rem",   // 350px
			// 	"71": "22.1875rem",  // 355px
			// 	"72": "22.5rem",     // 360px
			// 	"73": "22.8125rem",  // 365px
			// 	"74": "23.125rem",   // 370px
			// 	"75": "23.4375rem",  // 375px
			// 	"76": "23.75rem",    // 380px
			// 	"77": "24.0625rem",  // 385px
			// 	"78": "24.375rem",   // 390px
			// 	"79": "24.6875rem",  // 395px
			// 	"80": "25rem",       // 400px
			// 	"81": "25.3125rem",  // 405px
			// 	"82": "25.625rem",   // 410px
			// 	"83": "25.9375rem",  // 415px
			// 	"84": "26.25rem",    // 420px
			// 	"85": "26.5625rem",  // 425px
			// 	"86": "26.875rem",   // 430px
			// 	"87": "27.1875rem",  // 435px
			// 	"88": "27.5rem",     // 440px
			// 	"89": "27.8125rem",  // 445px
			// 	"90": "28.125rem",   // 450px
			// 	"91": "28.4375rem",  // 455px
			// 	"92": "28.75rem",    // 460px
			// 	"93": "29.0625rem",  // 465px
			// 	"94": "29.375rem",   // 470px
			// 	"95": "29.6875rem",  // 475px
			// 	"96": "30rem",       // 480px
			// 	"97": "30.3125rem",  // 485px
			// 	"98": "30.625rem",   // 490px
			// 	"99": "30.9375rem",  // 495px
			// 	"100": "31.25rem",   // 500px
			// 	"101": "31.5625rem", // 505px
			// 	"102": "31.875rem",  // 510px
			// 	"103": "32.1875rem", // 515px
			// 	"104": "32.5rem",    // 520px
			// 	"105": "32.8125rem", // 525px
			// 	"106": "33.125rem",  // 530px
			// 	"107": "33.4375rem", // 535px
			// 	"108": "33.75rem",   // 540px
			// 	"109": "34.0625rem", // 545px
			// 	"110": "34.375rem",  // 550px
			// 	"111": "34.6875rem", // 555px
			// 	"112": "35rem",      // 560px
			// 	"113": "35.3125rem", // 565px
			// 	"114": "35.625rem",  // 570px
			// 	"115": "35.9375rem", // 575px
			// 	"116": "36.25rem",   // 580px
			// 	"117": "36.5625rem", // 585px
			// 	"118": "36.875rem",  // 590px
			// 	"119": "37.1875rem", // 595px
			// 	"120": "37.5rem"     // 600px
			// },
			fontSize: {
				"3xs": "0.5625rem", // 9px
				"2xs": "0.625rem",  // 10px
				"xs": "0.6875rem",  // 11px
				"sm": "0.75rem",    // 12px
				"md": [ "0.875rem", {lineHeight: '1.3rem'} ],   // 14px
				"base": "1rem",     // 16px
				"lg": "1.125rem",   // 18px
				"xl": "1.3rem",     // 22px
				"2xl": [ "1.5rem", {lineHeight: '4rem'} ],    // 24px
				"3xl": "2.0rem",    // 32px
				"4xl": "2.25rem",   // 36px
				"5xl": "3rem",      // 48px
				"6xl": "4rem"       // 64px
			},
			screens: {
				"xl": "80rem", // 1280px
				'2xl': '100rem', // 1600px
				'3xl': '112.5rem',	 // 1800px
				'4xl': '150rem' // 2400px
			}, // 1800px
			keyframes: {
				"scrolling-banner": {
				  from: {transform: "translateX(0)"},
				  to: {transform: "translateX(-50%)"}
				},
				"scrolling-banner-vertical": {
				  from: {transform: "translateY(0)"},
				  to: {transform: "translateY(-50%)"}
				},
				aurora: {
					from: {backgroundPosition: "50% 50%, 50% 50%"},
					to: {backgroundPosition: "350% 50%, 350% 50%"}
				}
			  },
			  animation: {
				"scrolling-banner": "scrolling-banner var(--duration) linear infinite",
				"scrolling-banner-vertical": "scrolling-banner-vertical var(--duration) linear infinite",
				aurora: "aurora 60s linear infinite"
			  }
		}
	},
	darkMode: "class",
	plugins: [
		require('@tailwindcss/typography'),
		heroui({
			prefix: "xunaui", // prefix for themes variables
			addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
			defaultTheme: "light", // default theme from the themes object
			defaultExtendTheme: "light", // default theme to extend on custom themes
			layout: {}, // common layout tokens (applied to all themes)
			themes: {
				light: {
					layout: {}, // light theme layout tokens
					colors: {
						primary: "#2849F7",
						secondary: "#8752FA",
						xunaBlack: "#0B0B0B",
						xunaBlackSecondary: "#0D0D0D",
						xunaBlue: "#2849F7",
						xunaGray: "#A0A0A0",
						xunaBlue: "#2849F7",
						xunaPurple: "#8752FA",
						xunaPink: "#EEABFA",
						xunaBorder: "#ECECEC"
					} // light theme colors
				},
				dark: {
					layout: {}, // dark theme layout tokens
					colors: {
						primary: "#2849F7",
						secondary: "#8752FA",
						xunaBlack: "#0B0B0B",
						xunaBlackSecondary: "#0D0D0D",
						xunaBlue: "#2849F7",
						xunaGray: "#A0A0A0",
						xunaBlue: "#2849F7",
						xunaPurple: "#8752FA",
						xunaPink: "#EEABFA",
						xunaBorder: "#ECECEC"
					} // dark theme colors
				}
			}
		})
	]
};
