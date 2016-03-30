var path = require('path');
var webpack = require('webpack');
var isProd = (process.env.NODE_ENV == 'production' ? true : false);
var packageJSON = require('./package.json');

module.exports = {
    entry: {
        'sweatmap': ['./src/map.js'],
    },
    output: {
        path: 'dist',
		filename: '[name]'+ (isProd ? '-'+ packageJSON.version +'.min' : '') +'.js'
    },
    debug: true,
    devtool: isProd ? 'false' : 'source-map',
    resolve: {
        root: [ path.resolve('src') ]
    },
    module: {
        loaders: [].concat(isProd ? [
            {
                test: /src\/.*\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /(node_modules|js\/lib)/
            }
        ] : [])
    },
    plugins: [].concat(isProd ? [
        new webpack.optimize.UglifyJsPlugin({
            screwIe8: true,
            minimize: true,
            comments: false,
            compress: { drop_console: true },
            mangle: {}
        })
    ] : []),
    node: { fs: "empty" }
};
