/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    	extend: {
    		colors: {
    			background: '#f8f9ff',
    			foreground: '#0b1c30',
    			card: {
    				DEFAULT: '#ffffff',
    				foreground: '#0b1c30'
    			},
    			popover: {
    				DEFAULT: '#ffffff',
    				foreground: '#0b1c30'
    			},
    			primary: {
    				DEFAULT: '#0058be',
    				foreground: '#ffffff'
    			},
    			secondary: {
    				DEFAULT: '#545f73',
    				foreground: '#ffffff'
    			},
    			muted: {
    				DEFAULT: '#eff4ff',
    				foreground: '#424754'
    			},
    			accent: {
    				DEFAULT: '#e5eeff',
    				foreground: '#0b1c30'
    			},
    			destructive: {
    				DEFAULT: '#ba1a1a',
    				foreground: '#ffffff'
    			},
    			border: '#c2c6d6',
    			input: '#c2c6d6',
    			ring: '#0058be',

    			// MD3 surface system
    			'surface': '#f8f9ff',
    			'surface-dim': '#cbdbf5',
    			'surface-bright': '#f8f9ff',
    			'surface-container-lowest': '#ffffff',
    			'surface-container-low': '#eff4ff',
    			'surface-container': '#e5eeff',
    			'surface-container-high': '#dce9ff',
    			'surface-container-highest': '#d3e4fe',
    			'surface-variant': '#d3e4fe',
    			'surface-tint': '#005ac2',

    			// MD3 on-colors
    			'on-surface': '#0b1c30',
    			'on-surface-variant': '#424754',
    			'on-background': '#0b1c30',
    			'on-primary': '#ffffff',
    			'on-secondary': '#ffffff',
    			'on-tertiary': '#ffffff',
    			'on-error': '#ffffff',

    			// MD3 primary containers & fixed
    			'primary-container': '#2170e4',
    			'on-primary-container': '#fefcff',
    			'primary-fixed': '#d8e2ff',
    			'primary-fixed-dim': '#adc6ff',
    			'on-primary-fixed': '#001a42',
    			'on-primary-fixed-variant': '#004395',

    			// MD3 secondary containers & fixed
    			'secondary-container': '#d5e0f8',
    			'on-secondary-container': '#586377',
    			'secondary-fixed': '#d8e3fb',
    			'secondary-fixed-dim': '#bcc7de',
    			'on-secondary-fixed': '#111c2d',
    			'on-secondary-fixed-variant': '#3c475a',

    			// MD3 tertiary system
    			'tertiary': '#006577',
    			'tertiary-container': '#008096',
    			'on-tertiary-container': '#f9fdff',
    			'tertiary-fixed': '#acedff',
    			'tertiary-fixed-dim': '#4cd7f6',
    			'on-tertiary-fixed': '#001f26',
    			'on-tertiary-fixed-variant': '#004e5c',

    			// MD3 error system
    			'error': '#ba1a1a',
    			'error-container': '#ffdad6',
    			'on-error-container': '#93000a',

    			// MD3 outline & inverse
    			'outline': '#727785',
    			'outline-variant': '#c2c6d6',
    			'inverse-surface': '#213145',
    			'inverse-on-surface': '#eaf1ff',
    			'inverse-primary': '#adc6ff',

    			chart: {
    				'1': '#0058be',
    				'2': '#006577',
    				'3': '#213145',
    				'4': '#2170e4',
    				'5': '#008096'
    			}
    		},
    		fontFamily: {
    			'headline': ['"Space Grotesk"', 'sans-serif'],
    			'body': ['"Inter"', 'sans-serif'],
    			'label': ['"Inter"', 'sans-serif'],
    		},
    		fontSize: {
    			'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
    			'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
    			'body-lg': ['1rem', { lineHeight: '1.75' }],
    			'label-md': ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.08em', fontWeight: '700' }],
    		},
    		boxShadow: {
    			ambient: '0 0 24px rgba(11, 28, 48, 0.06)',
    			'ambient-lg': '0 0 32px rgba(11, 28, 48, 0.08)',
    		},
    		backgroundImage: {
    			'cta-primary': 'linear-gradient(to right, #0058be, #2170e4)',
    			'cta-primary-br': 'linear-gradient(to bottom right, #0058be, #2170e4)',
    		},
    		width: {
    			'30': '7.5rem'
    		},
    		height: {
    			'20': '5rem'
    		},
    		animation: {
    			aurora: 'aurora 60s linear infinite'
    		},
    		keyframes: {
    			aurora: {
    				from: {
    					backgroundPosition: '50% 50%, 50% 50%'
    				},
    				to: {
    					backgroundPosition: '350% 50%, 350% 50%'
    				}
    			}
    		},
    		borderRadius: {
    			DEFAULT: '0.25rem',
    			lg: '0.5rem',
    			xl: '0.75rem',
    			'2xl': '1rem',
    			'3xl': '1.5rem',
    			full: '9999px'
    		},
    	}
    },
	plugins: [
		function({ addUtilities }) {
			addUtilities({
				'.line-clamp-3': {
					'display': '-webkit-box',
					'-webkit-line-clamp': '3',
					'-webkit-box-orient': 'vertical',
					'overflow': 'hidden',
				},
			})
		},
        require("tailwindcss-animate")
    ],
}
