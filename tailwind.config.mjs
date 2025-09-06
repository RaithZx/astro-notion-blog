/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			width: {
				'30': '7.5rem', // 120px
			},
			height: {
				'20': '5rem', // 80px
			}
		},
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
		}
	],
}
