const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack/webpack.common.config');
//const appsetttings = require('../appsettings.json');

module.exports = (env) => {

    const determineAddons = (addons) => {
        return [...[addons]]
            .filter(addon => Boolean(addon))
            .map(addon => require(`./webpack/addons/webpack.${addon}.js`));
    };
    console.log('Operator configuration ',env);
    env.Operator = env.Operator || {};
    const envConfig = require(`./webpack/webpack.${env.env}.config`);
    return webpackMerge(commonConfig(env), envConfig(env), ...determineAddons(env.addons));
};
