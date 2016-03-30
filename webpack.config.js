var path = require('path');
var webpack = require('webpack');
var isBabel = (process.env.NODE_ENV == 'babel' ? true : false);
var isProd = (process.env.NODE_ENV == 'production' || isBabel ? true : false);
var packageJSON = require('./package.json');

module.exports = {
    entry: {
        'sweatmap': ['./src/map.js'],
    },
    output: {
        path: 'dist',
		filename: '[name]-'+ (isBabel ? 'babel-' : '') + packageJSON.version + (isProd ? '.min' : '') +'.js'
    },
    debug: true,
    devtool: isProd ? 'false' : 'source-map',
    resolve: {
        root: [ path.resolve('src') ]
    },
    module: {
        loaders: [].concat(isBabel ? [
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
            minimize: true,
            comments: false,
            sourceMap: false,
            sourceMapIncludeSources: false,
            compress: { drop_console: true },
            mangle: {}
        })
    ] : []),
    node: { fs: "empty" }
};
