var path = require('path');
var webpack = require('webpack');
var isProd = (process.env.NODE_ENV == 'production' ? true : false);
var packageJSON = require('./package.json');

module.exports = {
    entry: {
        'sweatmap': ['./src/map.js']
    },
    output: {
        path: 'dist',
		filename: '[name]-'+ packageJSON.version + (isProd ? '.min' : '') +'.js'
    },
    debug: true,
    devtool: isProd ? 'false' : 'source-map',
    module: {
        loaders: [
            {
                test: /src\/.*\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: /(node_modules|js\/lib)/
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            comments: isProd ? false : undefined,
            sourceMap: isProd ? false : true,
            sourceMapIncludeSources: isProd ? false : true,
            compress: isProd ? { drop_console: true } : false,
            mangle: isProd ? {} : false
        }),
    ],
    node: { fs: "empty" }
};
