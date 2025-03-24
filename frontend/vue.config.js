module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  }
}