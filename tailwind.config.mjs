/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    	extend: {
    		colors: {
    			background: 'rgb(var(--background) / <alpha-value>)',
    			foreground: 'rgb(var(--foreground) / <alpha-value>)',
    			card: {
    				DEFAULT: 'rgb(var(--card) / <alpha-value>)',
    				foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
    			},
    			popover: {
    				DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
    				foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
    			},
    			primary: {
    				DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
    				foreground: 'rgb(var(--on-primary) / <alpha-value>)'
    			},
    			secondary: {
    				DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
    				foreground: 'rgb(var(--on-secondary) / <alpha-value>)'
    			},
    			muted: {
    				DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
    				foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
    			},
    			accent: {
    				DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
    				foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
    			},
    			destructive: {
    				DEFAULT: 'rgb(var(--error) / <alpha-value>)',
    				foreground: 'rgb(var(--on-error) / <alpha-value>)'
    			},
    			border: 'rgb(var(--border) / <alpha-value>)',
    			input: 'rgb(var(--input) / <alpha-value>)',
    			ring: 'rgb(var(--ring) / <alpha-value>)',

    			// MD3 surface system
    			'surface': 'rgb(var(--surface) / <alpha-value>)',
    			'surface-dim': 'rgb(var(--surface-dim) / <alpha-value>)',
    			'surface-bright': 'rgb(var(--surface-bright) / <alpha-value>)',
    			'surface-container-lowest': 'rgb(var(--surface-container-lowest) / <alpha-value>)',
    			'surface-container-low': 'rgb(var(--surface-container-low) / <alpha-value>)',
    			'surface-container': 'rgb(var(--surface-container) / <alpha-value>)',
    			'surface-container-high': 'rgb(var(--surface-container-high) / <alpha-value>)',
    			'surface-container-highest': 'rgb(var(--surface-container-highest) / <alpha-value>)',
    			'surface-variant': 'rgb(var(--surface-variant) / <alpha-value>)',
    			'surface-tint': 'rgb(var(--surface-tint) / <alpha-value>)',

    			// MD3 on-colors
    			'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
    			'on-surface-variant': 'rgb(var(--on-surface-variant) / <alpha-value>)',
    			'on-background': 'rgb(var(--on-background) / <alpha-value>)',
    			'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
    			'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',
    			'on-tertiary': 'rgb(var(--on-tertiary) / <alpha-value>)',
    			'on-error': 'rgb(var(--on-error) / <alpha-value>)',

    			// MD3 primary containers & fixed
    			'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
    			'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
    			'primary-fixed': 'rgb(var(--primary-fixed) / <alpha-value>)',
    			'primary-fixed-dim': 'rgb(var(--primary-fixed-dim) / <alpha-value>)',
    			'on-primary-fixed': 'rgb(var(--on-primary-fixed) / <alpha-value>)',
    			'on-primary-fixed-variant': 'rgb(var(--on-primary-fixed-variant) / <alpha-value>)',

    			// MD3 secondary containers & fixed
    			'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
    			'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
    			'secondary-fixed': 'rgb(var(--secondary-fixed) / <alpha-value>)',
    			'secondary-fixed-dim': 'rgb(var(--secondary-fixed-dim) / <alpha-value>)',
    			'on-secondary-fixed': 'rgb(var(--on-secondary-fixed) / <alpha-value>)',
    			'on-secondary-fixed-variant': 'rgb(var(--on-secondary-fixed-variant) / <alpha-value>)',

    			// MD3 tertiary system
    			'tertiary': 'rgb(var(--tertiary) / <alpha-value>)',
    			'tertiary-container': 'rgb(var(--tertiary-container) / <alpha-value>)',
    			'on-tertiary-container': 'rgb(var(--on-tertiary-container) / <alpha-value>)',
    			'tertiary-fixed': 'rgb(var(--tertiary-fixed) / <alpha-value>)',
    			'tertiary-fixed-dim': 'rgb(var(--tertiary-fixed-dim) / <alpha-value>)',
    			'on-tertiary-fixed': 'rgb(var(--on-tertiary-fixed) / <alpha-value>)',
    			'on-tertiary-fixed-variant': 'rgb(var(--on-tertiary-fixed-variant) / <alpha-value>)',

    			// MD3 error system
    			'error': 'rgb(var(--error) / <alpha-value>)',
    			'error-container': 'rgb(var(--error-container) / <alpha-value>)',
    			'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',

    			// MD3 outline & inverse
    			'outline': 'rgb(var(--outline) / <alpha-value>)',
    			'outline-variant': 'rgb(var(--outline-variant) / <alpha-value>)',
    			'inverse-surface': 'rgb(var(--inverse-surface) / <alpha-value>)',
    			'inverse-on-surface': 'rgb(var(--inverse-on-surface) / <alpha-value>)',
    			'inverse-primary': 'rgb(var(--inverse-primary) / <alpha-value>)',

    			chart: {
    				'1': 'rgb(var(--chart-1) / <alpha-value>)',
    				'2': 'rgb(var(--chart-2) / <alpha-value>)',
    				'3': 'rgb(var(--chart-3) / <alpha-value>)',
    				'4': 'rgb(var(--chart-4) / <alpha-value>)',
    				'5': 'rgb(var(--chart-5) / <alpha-value>)'
    			}
    		},
    		fontFamily: {
    			'headline': ['"Space Grotesk"', 'sans-serif'],
    			'body': ['"Inter"', 'sans-serif'],
    			'label': ['"Inter"', 'sans-serif'],
    			'article': ['"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
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
    			lg: '0.375rem',
    			xl: '0.5rem',
    			'2xl': '0.625rem',
    			'3xl': '0.875rem',
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
