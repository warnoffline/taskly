import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        chatLight: {
          bg: '#F9FAFB', // Фон чата
          header: '#FFFFFF', // Фон хедера
          input: '#E5E7EB', // Поле ввода
          bubbleIncoming: '#E4F3FF', // Входящие сообщения
          bubbleOutgoing: '#D1FAE5', // Исходящие сообщения
          text: '#1F2937', // Основной текст
          secondaryText: '#6B7280', // Вторичный текст
        },
        chatDark: {
          bg: '#18191A', // Фон чата
          header: '#242526', // Фон хедера
          input: '#3A3B3C', // Поле ввода
          bubbleIncoming: '#2E4A63', // Входящие сообщения
          bubbleOutgoing: '#3D7256', // Исходящие сообщения
          text: '#E4E4E7', // Основной текст
          secondaryText: '#A3A3A6', // Вторичный текст
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
