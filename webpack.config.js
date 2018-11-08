const path = require('path');
module.exports = {
    devtool: 'eval-source-map',
    entry: {
        client: './src/client.js',
        bundle: './src/bundle.js'
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: "[name].js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: [/node_modules/, /tests/], loader: "babel-loader" }
        ]
    }
}