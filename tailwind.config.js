module.exports = {
  content: ["./**/*.tsx", "./App.tsx"],
  theme: {
    extend: {
      fontFamily: {
        'Roboto': ['Roboto', 'sans-serif'],
        'Operator': ['Operator Mono', 'sans-serif'],
        'Mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
        'Muller': ['Muller ExtraBold DEMO']
      }
    },
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
