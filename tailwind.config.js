/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Activa el modo oscuro con la clase `dark`
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Asegúrate de que Tailwind analice estos archivos
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Aquí defines los colores para los temas personalizado
        light: {
          primary: '#f0f0f0',
          text: '#333',
        },
        dark: {
          primary: '#1a1a1a',
          text: '#e5e5e5',
        },
        mixto: {
          primary: '#001f3f',
          text: '#ffdd57',
        }
      },
    },
  },
  plugins: [],
};











// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//     },
//   },
//   plugins: [],
// };
