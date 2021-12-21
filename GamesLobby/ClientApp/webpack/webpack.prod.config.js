const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');



const config = () => {
    return {
        stats: 'errors-only',
        plugins: [
            new TerserPlugin(/* ... */),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                'NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.AggressiveMergingPlugin()
        ],
        devtool: 'source-map',
        optimization: {
            namedModules: false,
            namedChunks: false,
            nodeEnv: 'production',
            flagIncludedChunks: true,
            occurrenceOrder: true,
            concatenateModules: true,
            noEmitOnErrors: true,
            checkWasmTypes: true,
            minimize: false
        }
    };
};

module.exports = config;
