/** @type {import('postcss-load-config').Config} */

const config = {
  plugins: {
    '@tailwindcss/postcss': {
      config: {
        plugins: ['daisyui'],
        daisyui: {
          themes: ['shine', 'darkness'],
          darkTheme: 'darkness',
          base: true,
          styled: true,
          utils: true,
          prefix: '',
          logs: true,
          themeRoot: ':root',
        },
      },
    },
  },
};
export default config;
