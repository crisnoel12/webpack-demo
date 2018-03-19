let webpack = require('webpack');
let path = require('path');
const glob = require('glob-all');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.NODE_ENV === "development"
});

const purifyCss = new PurifyCSSPlugin({
    paths: glob.sync([
        path.join(__dirname, '*.html'),
        path.join(__dirname, 'section/*.html')
    ])
});


module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: "css-loader", options: { importLoaders: 1 }  }, 
                        { loader: "postcss-loader" }, 
                        { loader: "sass-loader" }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        extractSass,
        purifyCss
    ]
};
