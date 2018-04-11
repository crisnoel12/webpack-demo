let webpack = require('webpack');
let path = require('path');
const glob = require('glob-all');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // minify JS
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // minify css
const PurifyCSSPlugin = require('purifycss-webpack'); // remove unused css

const purifyCss = new PurifyCSSPlugin({
    paths: glob.sync([
        path.join(__dirname, '*.html'),
        path.join(__dirname, 'section/*.html')
    ])
});


module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                        MiniCssExtractPlugin.loader,
                        { loader: "css-loader", options: { importLoaders: 1 }  }, 
                        { loader: "postcss-loader" }, 
                        { loader: "sass-loader" }
                     ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        purifyCss
    ]
};
