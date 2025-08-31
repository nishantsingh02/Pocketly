module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        lg: '8px',
      },
    },
  },
  variants: {
    extend: {
      backdropBlur: ['hover'],
      gradientColorStops: ['dark'],
    },
  },
  darkMode: 'class', // or 'media' if you want to respect system preferences
} 