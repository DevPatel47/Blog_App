const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: "./src/client/index.js",
    output: {
        path: path.resolve("dist"),
    },
    devtool: "source-map",
    devServer: {
        open: true,
        host: "localhost",
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/index.ejs",
            filename: "index.html",
            inject: "body",
            title: "Blog App",
            description: "A simple blog application built with Node.js, Express, and Ejs.",
            hash: true,
        }),

        new MiniCssExtractPlugin(),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, "css-loader", "sass-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/i,
                type: "asset",
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/i,
                type: "asset",
                generator: {
                    filename: "images/[name][ext]",
                },
            },
            {
                test: /\.ejs$/,
                use: {
                    loader: "ejs-compiled-loader",
                    options: {
                        htmlmin: true,
                        htmlminOptions: {
                            removeComments: true,
                        },
                    },
                },
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = "development";
    }
    return config;
};
