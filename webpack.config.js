const path = require('path');
const src_dir = path.join(__dirname, '/client/src');
const dist_dir = path.join(__dirname, '/public/dist');

module.exports = {
  entry: `${src_dir}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: dist_dir
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        include : src_dir,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'es2015']
       }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  }
};