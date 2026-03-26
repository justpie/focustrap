const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: {
        index: "./src/index.ts",
        demo: {
            dependOn: "index",
            import: "./src/demo.ts",
        },
    },
    mode: "development", // change to development for easier debugging
    plugins: [
        new HtmlWebpackPlugin({
            template: "template/index.html",
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "template"),
        },
        port: 8000,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        globalObject: "this",
        library: {
            name: "FocusTrap",
            type: "umd",
        },
    },
};
