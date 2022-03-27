module.exports = {
  outputDir: '../public',
  runtimeCompiler: true,

  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      '/version': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      '/node-api/': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      '/static-form': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5100',
        changeOrigin: true,
        ws: true,
      },
      '/ticket-api/': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
      // '/ticket': {
      //   target: 'https://proxy.finance.qq.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ticket': '', // 路径重写
      //   },
      // },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'zh',
      fallbackLocale: 'zh',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};
