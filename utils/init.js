import unhandled from 'cli-handle-unhandled';
import welcome from 'cli-welcome';
import { getPackageJson } from 'get-package-json-file';
import handleCommandRouter from './lib/handleExtract.js';
import cli from './cli.js';

export default async ({ clear = true }) => {
	const { input } = cli;
	unhandled();
	const pkgJson = await getPackageJson(`./../package.json`);
	if (input && input[0] !== undefined) {
		handleCommandRouter(process.argv);
	} else {
		welcome({
			title: `move2ts`,
			tagLine: `by SAGHE_DEV`,
			description: pkgJson.description,
			version: pkgJson.version,
			bgColor: '#A699EA',
			color: '#000000',
			bold: true,
			clear
		});
	}
};
