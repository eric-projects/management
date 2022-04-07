const CompressionWebpackPlugin = require('compression-webpack-plugin');
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
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)(\?.*)?$/i,
        threshold: 10240, // 对超过10k的数据进行压缩
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
        cache: false, // 编译/打包生成缓存文件 node_modules\.cache\compression-webpack-plugin 导致磁盘过大 https://webpack-3.cdn.bcebos.com/plugins/compression-webpack-plugin/
      }),
    ],
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
