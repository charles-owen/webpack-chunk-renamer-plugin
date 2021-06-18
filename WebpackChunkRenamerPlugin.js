/**
 * Simple Webpack plugin that renames chunks.
 *
 * Adds the template option [lc-name] that will
 * substitute in a lower-case version of a name.
 *
 * This allows exporting a module like Console, while leaving the name of
 * the generate .js file as console.js.
 *
 * Also can allow some chunks to have a different naming
 * convention than others. For example, you can turn off
 * [chunkhash] on vendor.js if required.
 */
function WebpackChunkRenamerPlugin(options) {

    this.apply = function(compiler) {
        const REGEXP_NAME = /\[lc-name\]/gi;

        compiler.hooks.compilation.tap("WebpackChunkRenamerPlugin", compilation => {

            compilation.hooks.assetPath.tap(
                "WebpackChunkRenamerPlugin",
                (path, data) => {
                    const chunk = data.chunk;
                    const chunkName = chunk && (chunk.name || chunk.id);

                    if (typeof path === "function") {
                        path = path(data);
                    }

                    if(options[chunkName] !== undefined) {
                        path = options[chunkName];
                    }

                    return path.replace(REGEXP_NAME, (match, ...args) => {
                        return chunkName.toLowerCase();
                    });
                }
            );

	        compilation.hooks.renderManifest.tap(
	            "WebpackChunkRenamerPlugin",
                (path, data) => {
	                const chunk = data.chunk;
	                const outputOptions = data.outputOptions;

	                if( options.initialChunksWithEntry &&
                        (compilation.chunkGraph.getNumberOfEntryModules(chunk) > 0) &&
		                // chunk.hasEntryModule() &&
		                chunk.isOnlyInitial()) {

		                chunk.filenameTemplate = outputOptions.filename;
	                }

                }
            );
        })
    }

}

module.exports = WebpackChunkRenamerPlugin;