module.exports = {
    mode: 'production',
    entry: {
        background: './src/background.ts',
        content: './src/content.ts',
        search: './src/search.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ],
    },
    resolve: {
        extensions: [
            '.ts', '.tsx', '.js'
        ],
    },
    output: {
        path: `${__dirname}/build`,
        filename: '[name].js'
    }
};
