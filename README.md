# webpack-chunk-renamer-plugin

_Adds the template option [lc-name] that will substitute a lower-case name. Also adds automatic renaming of chunks._

Version 1.0.0 requires Webpack 5.

I prefer to have my exported JavaScript objects start with an upper-case letter, but I like
the actual JavaScript files to be all lower case names. For example, suppose you have 
these entry points:

``` javascript
    entry: {
        Console: './src/Console/Console.js',
        Site: './src/Site/Site.js'
    },
```

Then configure the output this way to create a library with the name exposed as a global object.

``` javascript
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: "default",
        publicPath: ''
    },
```

The library will export Console and Site, but will also name the .js files Console.js and Site.js. 
I prefer that the files be console.js and site.js, which is consistent with many libraries. Setting the 
entry points as console and site will do that, but then the exported global variables will be
console and site as well.

This plugin adds a new template: [lc-name] that will convert the name to lower case. It can be used in
place of [name] to specify the file name:

``` javascript
    output: {
        filename: '[lc-name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: "default",
        publicPath: ''
    },
```

Now the exported global variables will be Console and Site and the files console.js and site.js.

## Chunk Renaming

The other renaming functionality this plugin supports is renaming entry chunks. The main reason for these
features is to overcome the overly aggressive renaming of chunks that Webpack does by default. 
 
If the option initialChunksWithEntry 
is set true, the initial chucks will use output.filename as their name:

``` javascript
    plugins: [
        new WebpackChunkRenamerPlugin({
	        initialChunksWithEntry: true
        })
    ],
```

It can also be used to specify a specific name for a chunk:

``` javascript
    plugins: [
        new WebpackChunkRenamerPlugin({
            'vendor': 'vendor.js',
            'commons': 'commons.js'
        })
    ],
```

This is useful to ensure the vendor chunk has the name vendor.js rather than having a hash value in it.

## Install

[npm](https://www.npmjs.com/package/webpack-chunk-renamer-plugin): `npm install webpack-chunk-renamer-plugin --save-dev`

## Utilizing

Require the plugin in webpack.config.js:

``` javascript 
const WebpackChunkRenamerPlugin = require('webpack-chunk-renamer-plugin');
```

And add to the list of plugins with an options:

``` javascript
    plugins: [
        new WebpackChunkRenamerPlugin({
            'vendor': 'vendor.js',
            'commons': 'commons.js',
	        initialChunksWithEntry: true
        })
    ],
```

## An Issue with splitChunks

If utilized with splitChunks, the generated filename may not be as expected. For example, suppose we apply the above
example and this splitChunks configuration to create a vendor chunk:

``` javascript
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
```

The generated output file will be vendor.vendor.js. The reason is that splitChunks will look at the generated
filename and ensure it will be unique if more than one chunk is generated. The code tests to ensure
either [id] or [name] are present. If neither is present, it prefixes [id]. to the filename, creating 
[id].[lc-name].js, which creates the file vendor.vendor.js. The fix for this problem is to specify the 
name for chunked files separately using [name] instead of [lc-name]:

``` javascript
    output: {
        filename: '[lc-name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: "default",
        publicPath: ''
    },
```

## License

webpack-chunk-renamer-plugin is released under the MIT license.

* * *

Made by Charles B. Owen

