const path = require('path');
const webpack = require('webpack');
const CleanWebPackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const commonPaths = require('./common-paths');


const skinAppEntryPoints = {
    'default': {
        entry: { main: './Skins/Default/index.js' },
        indexTemplate: './Skins/Default/index.html'
    }
};

const config = (env) => {
    var outFileName = 'js/[name]-[chunkhash].js';
    var outCssName = 'css/styles-[chunkhash].css';
    if (env.env == 'dev') {
        outFileName = 'js/main.js';
        outCssName = 'css/styles.css';
    }

    var skin = (env.Skin && env.Skin != '') ? env.Skin : 'default';

    return {
        entry: skinAppEntryPoints[skin].entry,
        output: {
            filename: outFileName,
            path: path.resolve(commonPaths.outputPath, ''),
            publicPath: '/',
            hashDigestLength: 8
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: true,
                        failOnerror: true
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.s?css$/,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ]
                    //exclude: /node_modules/
                },
                {
                    test: /\.svg|.png|.jpg$/,
                    loader: 'url-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader'
                },
                {
                    test: /\.(jpe?g|gif|png|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000
                            }
                        }
                    ]
                }
            ]
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    default: {
                        enforce: true, priority: 1
                    }, vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: 2,
                        name: 'vendors',
                        enforce: true,
                        chunks: 'all'
                    }
                }
            }
        },
        plugins: [
            new CleanWebPackPlugin(),
            new MiniCssExtractPlugin({
                filename: outCssName
            }),
            new HtmlWebPackPlugin({
                template: skinAppEntryPoints[skin].indexTemplate
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        ]
    };
};

module.exports = config;
