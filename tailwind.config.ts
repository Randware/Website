import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',

  theme: {
    extend: {
      colors: {
        background: 'rgba(var(--background))',
        foreground: 'rgba(var(--foreground))'
      }
    }
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;
