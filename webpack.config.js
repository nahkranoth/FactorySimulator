const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var copyWebpackPlugin = new CopyWebpackPlugin([{
    from: path.resolve(__dirname, 'assets', '**', '*'),
    to: path.resolve(__dirname, 'build')
}]);

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    DEBUG: true,
    WEBGL_RENDERER: true, // I did this to make webpack work, but I'm not really sure it should always be true
    CANVAS_RENDERER: true // I did this to make webpack work, but I'm not really sure it should always be true
});

module.exports = {
    entry: {
        app:"./src/main.js"
    },
    output: {
        path: path.resolve(__dirname + "/build"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {test: /\.css$/, use: ['style-loader', 'css-loader']}
        ]
    },
    plugins: [
        definePlugin,
        copyWebpackPlugin,
        new webpack.ProvidePlugin({
            _: 'underscore'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        open: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                node_vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority:1
                }
            }
        }
    }
};