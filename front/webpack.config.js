var debug   = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path    = require('path');
const HtmlWebpackPlugin = debug ? require('html-webpack-plugin') : null;

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: 'development',
  context: path.join(__dirname, "src"),
  entry: ['webpack/hot/dev-server', "./js/client.js"],
  target: 'web',
  // 追加
//  watchOptions: {
    // 最初の変更からここで設定した期間に行われた変更は1度の変更の中で処理が行われる
  //  aggregateTimeout: 200,
    // ポーリングの間隔
  //  poll: 1000
  //},

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [debug && require.resolve("react-refresh/babel")].filter(Boolean),
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
    output: {
      path: path.join(__dirname, "src"),
      publicPath: "/",
      filename: "client.min.js"
    },
    plugins: debug ? [] : [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
      debug && new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        filename: './index.html',
        template: path.resolve(__dirname, 'src/index.html'),
      }),
      debug && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    devServer: {
      open: true,//ブラウザを自動で開く
      openPage: "index.html",//自動で指定したページを開く
      contentBase: path.join(__dirname, 'src'),// HTML等コンテンツのルートディレクトリ
      watchContentBase: true,//コンテンツの変更監視をする
      port: 8080, // ポート番号
      historyApiFallback: true,
      host: '0.0.0.0',//Dockerコンテナ側のipアドレス
      inline: true,
      hot: true,
      watchOptions:{
        poll: 500,
        aggregateTimeout: 300,
        ignored: /node_modules/
      },
      proxy: {
        '/api/**': {
          target: 'http://localhost:3000',
          secure: false,
          logLevel: 'debug'
        }
      },
    },
    devtool: 'inline-source-map',
};
