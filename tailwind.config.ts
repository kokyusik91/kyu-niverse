import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        // 여기에 커스텀 애니메이션 이름을 지정하고, 원하는 애니메이션을 정의합니다.
        movescv: {
          '0%': { transform: 'translateX(30px)' },
          '100%': { transform: 'translateX(-30px)' },
        },
        movescv2: {
          '0%': { transform: 'translate(0, 0) rotate(-40deg)' },
          '20%': { transform: 'translate(120px, 0) rotate(40deg)' },
          '40%': { transform: 'translate(120px, 120px) rotate(-400deg)' },
          '60%': { transform: 'translate(0, 120px) rotate(40deg)' },
          '100%': { transform: 'translate(0,0) rotate(-40deg)' },
        },
        movescv3: {
          '0%': { transform: 'skew(30deg, -20deg)' },
          '20%': { transform: 'skew(-50deg, 50deg)' },
          '40%': { transform: 'skew(30deg, -20deg)' },
          '60%': { transform: 'skew(-50deg, 50deg)' },
          '100%': { transform: 'skew(30deg, -20deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
