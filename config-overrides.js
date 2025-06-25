const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve.fallback = {
        "path": require.resolve('path-browserify'),
        "crypto": require.resolve('crypto-browserify'),
        "stream": require.resolve('stream-browserify'),
        "assert": require.resolve('assert'),
        "http": require.resolve('stream-http'),
        "https": require.resolve('https-browserify'),
        "os": require.resolve('os-browserify'),
        "url": require.resolve('url'),
        "buffer": require.resolve('buffer/')
    };
    
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer']
        })
    ]);

    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
    });

    config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Failed to parse source map from '.*docx-preview.*'/,
    ];
    
    return config;
}
