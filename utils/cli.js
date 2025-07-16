import meowHelp from 'cli-meow-help';
import meow from 'meow';

const flags = {
	clear: {
		type: `boolean`,
		default: false,
		shortFlag: `c`,
		desc: `Clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		shortFlag: `d`,
		desc: `Print debug info`
	},
	target: {
		type: `string`,
		default: '',
		shortFlag: `target`,
		desc: `Target source file (.Move) file to be converted`
	},
	output: {
		type: `string`,
		default: '',
		shortFlag:`print-to`,
		desc: `Optional value of where result should be printed`
	},
};

const commands = {
	help: { desc: `Print help info` },
	extract: { desc: `Extract Move module to be converted to ts` }
};

const helpText = meowHelp({
	name: `move2ts`,
	flags,
	commands
});

const options = {
	importMeta: import.meta,
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
