const path = require('path');

module.exports = {
    mode:'development',
    entry: './scripts/index.js',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader', // Add Babel loader if needed
            },
        ],
    },
};
