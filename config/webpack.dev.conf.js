const webpack = require('webpack');
const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const paths = require('./paths');

module.exports = merge(baseWebpackConfig, {
	mode      : 'development',
	devtool   : 'eval-cheap-module-source-map',
	devServer : {
		historyApiFallback : true,
		contentBase        : paths.dist,
		open               : true,
		compress           : true,
		port               : 8080,
	},
	plugins: [
		new webpack.SourceMapDevToolPlugin({
			filename: '[file].map',
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	performance: {
		hints             : 'warning',
		maxEntrypointSize : 512000,
		maxAssetSize      : 512000,
	},
});
