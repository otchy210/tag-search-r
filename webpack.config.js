module.exports = {
    mode: 'development',
    entry: './src/content.ts',
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
        filename: 'content.js'
    }
};
