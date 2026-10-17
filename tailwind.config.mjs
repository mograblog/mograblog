/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@mograblog/web-agent-loop/dist/**/*.{js,cjs}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.neutral.700'),
            a: {
              color: theme('colors.sky.600'),
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: theme('colors.sky.500'),
              },
            },
            h1: { color: theme('colors.neutral.900'), fontWeight: '800' },
            h2: { color: theme('colors.neutral.900'), fontWeight: '700' },
            h3: { color: theme('colors.neutral.800'), fontWeight: '600' },
            strong: { color: theme('colors.neutral.900'), fontWeight: '600' },
            blockquote: {
              color: theme('colors.neutral.700'),
              borderLeftColor: theme('colors.neutral.300'),
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: theme('colors.neutral.100'),
              color: theme('colors.neutral.800'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#18181b',
              color: '#f4f4f5',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '1px solid #27272a',
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.neutral.300'),
            a: {
              color: theme('colors.sky.400'),
              '&:hover': {
                color: theme('colors.sky.300'),
              },
            },
            h1: { color: theme('colors.neutral.50') },
            h2: { color: theme('colors.neutral.100') },
            h3: { color: theme('colors.neutral.200') },
            h4: { color: theme('colors.neutral.200') },
            strong: { color: theme('colors.neutral.100') },
            blockquote: {
              color: theme('colors.neutral.300'),
              borderLeftColor: theme('colors.sky.500'),
            },
            code: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: theme('colors.neutral.100'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#121214',
              color: '#f4f4f5',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              border: '1px solid #27272a',
            },
            hr: { borderColor: theme('colors.neutral.800') },
            'ul > li::marker': { color: theme('colors.neutral.500') },
            'ol > li::marker': { color: theme('colors.neutral.500') },
            th: { color: theme('colors.neutral.100') },
            td: { color: theme('colors.neutral.300') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
