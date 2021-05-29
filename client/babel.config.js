module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'entry',
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'antd-mobile-vue',
        libraryDirectory: 'es',
        style: true,
      },
      'antd-mobile-vue',
    ],
  ],
};
