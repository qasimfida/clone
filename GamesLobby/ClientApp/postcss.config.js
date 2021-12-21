//https://www.postcss.parts/

module.exports = {
    plugins: [
        require('cssnano')({
            preset: 'default',
        })
    ],
};