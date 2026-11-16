const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => ({
    mode: argv.mode || 'production',
    entry: {
        content: './src/content.js',
        background: './src/background.js',
        popup: './src/popup/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    devtool: argv.mode === 'development' ? 'cheap-module-source-map' : false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } },
            },
            {
                // CSS is imported as a string and injected into the Shadow DOM / popup at runtime.
                test: /\.css$/i,
                use: [{ loader: 'css-loader', options: { exportType: 'string' } }],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/popup/popup.html',
            filename: 'popup.html',
            chunks: ['popup'],
            inject: 'body',
        }),
    ],
});
