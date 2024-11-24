const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
            {
                test: /\.css$/i, // Match .css files
                use: [MiniCssExtractPlugin.loader, 'css-loader'], // Extract and process CSS
            },
        ],
    },
    plugins: [
        // Plugin to bundle CSS into a separate file
        new MiniCssExtractPlugin({
            filename: 'styles.bundle.css', // Output CSS file
        }),
    ],
};
