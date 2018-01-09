const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: __dirname + "/app/index.js", //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build", //打包后的文件存放的地方
        filename: "bundle.js" //打包后输出文件的文件名
    },
    devtool: 'eval-source-map', //在开发阶段 使用的配置项
    devServer: {
        contentBase: "./build", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        hot: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [              //请注意这里对同一个文件引入多个loader的方法。
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' //相同的类名也不会造成不同组件之间的污染。
                        }
                    }, {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/\.(png|gif|jpg|jpeg|bmp)$/,
                loader:'url-loader?limit=1&name=images/[name].[hash:8].[ext]'//注意图片资源的配置
            },
            {
                test:/\.(woff|woff2|svg|ttf|eot)($|\?)/,//字体文件资源的配置
                loader:'file-loader?name=fonts/[name].[hash:8].[ext]'
                //这样做能够保证引用的是图片资源的最新修改版本，保证浏览器端能够即时更新。
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin()//热加载插件
    ]
};