module.exports = {
    mode: 'development',
    entry: './src/content.ts',
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
        }],
    },
    resolve: {
        extensions: [
            '.ts', '.js',
        ],
    },
    output: {
        path: `${__dirname}/build`,
        filename: 'content.js'
    }
};
