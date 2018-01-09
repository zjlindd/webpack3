const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    entry: {
        "app": __dirname + "/app/index.js",
        // 将 第三方依赖 单独打包
        "vendor": [
            'react',
            'react-dom'
        ]
    }, //已多次提及的唯一入口文件
    output: {
        path: __dirname + "/product", //打包后的文件存放的地方
        filename: "script/[name].[chunkhash:8].js", //打包后输出文件的文件名
        publicPath: '/'
    },
    devtool: 'null', //注意修改了这里，这能大大压缩我们的打包代码
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
                exclude: '/node_modules/',
                use: ExtractTextPlugin.extract({
                    fallback: [{
                        loader: 'style-loader',
                    }],
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                        },
                    }, {
                        loader: 'postcss-loader',
                    }],
                }),
            },
            {
                test: /\.less$/,
                exclude: '/node_modules/',
                use: ExtractTextPlugin.extract({
                    fallback: [{
                        loader: 'style-loader',
                    }],
                    use: [
                        {
                            loader: 'css-loader',
                        }, {
                            loader: 'postcss-loader',
                        }, {
                            loader: 'less-loader',
                        }],
                }),
            }, {
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
        new webpack.BannerPlugin('@zjlindd'),

        //html模板
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        //热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurrenceOrderPlugin(),

        //压缩js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        // 分离CSS和JS文件
        new ExtractTextPlugin('style/[name].[chunkhash:8].css'),

        //css代码压缩
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        }),
        // 清除product下的文件
        new CleanWebpackPlugin('product/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        //提取公共的模块
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', // 将公共模块提取，生成名为`vendors`的chunk
            filename: 'script/[name].[hash:8].js'
        }),
        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ]
};