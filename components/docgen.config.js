module.exports = {
	componentsRoot: 'src', // the folder where CLI will start searching for components.
	outDir: 'src', // folder to save components docs in (relative to the current working directry)
	getDocFileName: (componentPath: string) => componentPath.replace(/\.vue$/, '.md'), // specify the name of the input md file
	getDestFile: (file: string, config: DocgenCLIConfig) => path.join(config.outDir, file).replace(/\.vue$/, '.doc.md'), // specify the name of the output md file
};
