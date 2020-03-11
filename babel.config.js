module.exports = {
  presets: [['@babel/preset-env']],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    [
      '@babel/plugin-transform-modules-commonjs',
      {
        allowTopLevelThis: true,
      },
    ],
  ],
}
