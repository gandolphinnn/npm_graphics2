import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

// Deriva __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	mode: "development",
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				include: [path.resolve(__dirname, "src")],
				use: "ts-loader",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			'@gandolphinnn/utils': path.resolve(__dirname, 'node_modules/@gandolphinnn/utils'),
		}
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		libraryTarget: "umd", // Configura l'output come un modulo universale
		globalObject: "this", // Necessario per UMD nei contesti Node.js
		sourceMapFilename: '[file].map',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html", // Usa index.html come root
		}),
	],
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"), // Serve la directory dist
		},
		compress: true,
		port: 4000,
		historyApiFallback: true
	},
};