const commonPaths = require('./common-paths');
var ProgressBarPlugin = require('fig-webpack-progress');

const config = () => {
    return {
        devtool: 'source-map',
        devServer: {
            contentBase: commonPaths.outputPath,
            compress: false,
            historyApiFallback: true,
            hot: true,
            port: 9000
        },
        mode: 'development',
        plugins: [
            new ProgressBarPlugin()
        ]
    };
};

module.exports = config;