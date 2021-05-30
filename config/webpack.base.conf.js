const paths = require('./paths');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');


module.exports = {
	entry: {
		index: `${paths.src}/js/index.js`,
	},
	output: {
		path     : paths.dist,
		filename : 'js/[name].bundle.js',
	},
	module: {
		rules: [
			{
				test    : /\.js$/i,
				exclude : '/node_modules/',
				use     : 'babel-loader',
			},
			{
				test : /\.(png|jpe?g|svg|gif)$/i,
				use  : [
					{
						loader  : 'file-loader',
						options : {
							name     : '[path][name].[ext]',
							emitFile : false,
						},
					},
				],
				type: 'asset/resource',

			},
			{
				test : /\.css$/i,
				use  : [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader  : 'postcss-loader',
						options : {
							postcssOptions: {
								config: path.resolve(paths.root, 'postcss.config.js'),
							},
							sourceMap: true,

						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from : `${paths.src}/manifest.json`,
					to   : `${paths.dist}/manifest.json`,
				},
				{
					from : `${paths.src}/serviceWorker.js`,
					to   : `${paths.dist}/serviceWorker.js`,
				},
				{
					from : `${paths.src}/img`,
					to   : `${paths.dist}/img`,
				},
			],
		}),
		new ImageminPlugin({
			interlaced  : true,
			progressive : true,
			svgPlugins  : [ {removeViewBox: false} ],
			plugins     : [
				mozjpeg({quality: 50}),
				pngquant(),
			],
		}),
		new HTMLWebpackPlugin({
			inject   : 'body',
			template : `${paths.src}/index.html`,
		}),
	],
};
