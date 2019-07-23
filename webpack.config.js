const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = [{
    mode: 'production',
    target: 'node',
    externals: [nodeExternals()],
    entry: "./src/khttp.js",
    output: {
        path: path.resolve(__dirname),
        filename: 'index.js',
        library: 'majidai',
        libraryTarget: 'umd'
    },
}, ];