#!/usr/bin/env node

/**
 * move2ts
 * This is a CLI to convert Move syntax to usable TypeScript types for developers
 *
 * @author SAGHE_DEV <github.com/SAGHEDEV>
 */

import cli from './utils/cli.js';
import init from './utils/init.js';
import log from './utils/log.js';

const { flags, input, showHelp } = cli;
const { clear, debug } = flags;

(async () => {
	await init({ clear });
	debug && log(flags);
	input.includes(`help`) && showHelp(0);
})();
