const path = require('path');

module.exports = {
	componentsRoot: 'src',
	outDir: 'src',
	getDestFile: (file, config) => path.join(config.outDir, file).replace(/\.vue$/, '.story.md'),
};
