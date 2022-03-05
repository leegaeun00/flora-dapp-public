module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "net": false,
        "http": require.resolve("stream-http"),
        "https": require.resolve('https-browserify'),
        "os": require.resolve('os-browserify/browser'),
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "url": require.resolve("url/")
    }
    return config
}