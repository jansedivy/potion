var webpack = require('webpack');

var header = [
  '/**',
  '* potion - v' + require('./package.json').version,
  '* Copyright (c) 2015, Jan Sedivy',
  '*',
  '* Potion is licensed under the MIT License.',
  '*/'
].join('\n');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

plugins.push(
  new webpack.BannerPlugin(header, { raw: true })
);

module.exports = {
  output: {
    library: 'Potion',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  },

  node: {
    Buffer: false
  },

  plugins: plugins
};
