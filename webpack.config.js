var path = require('path');
var webpack = require('webpack');

module.exports = {
    devServer: {
    address: '127.0.0.1',
    port: 8000
},
        context: __dirname,
	entry : './src/main.js',
	output : {path : __dirname + '/public', filename : 'bundle.js'},
	module : {
		loaders :[
              {
           	test : /.jsx?$/,
           	loader: 'babel-loader',
           	exclude: /node_modules/,
           	query:{
           		presets : ['es2015', 'react']
           	}
             },
          { test: /\.css$/, loader: "style-loader!css-loader" }
		]
	},

};
