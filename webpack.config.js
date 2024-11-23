const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/content.js', // Adjust the path to your main content script
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'content.bundle.js', // Output bundle
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
