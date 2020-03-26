/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 20.
 */

/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 03. 20.
 */

const path = require('path')

module.exports = {
  // Tell webpack for the root file of our server application
  entry: './system/react/browser.js',

  // Tell webpack where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets')
  },

  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            'react',
            'stage-0',
            ['env', {targets: { browsers: ['last 2 versions'] }}]
          ]
        }
      }
    ]
  }
}
