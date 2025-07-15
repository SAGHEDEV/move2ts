import alert from 'cli-alerts';
import fs from 'fs';
import path from 'path';
import cli from '../cli.js';
import chalk from 'chalk';
import boxen from 'boxen';

const handleCommandRouter = args => {
	const { input } = cli;

	switch (input[0]) {
		case 'extract':
			return handleGetFileContent();
		default:
			alert({
				type: `error`,
				msg: `Command "${input[0]}" does not exist! Only command: ["extract"] is/are supported for now!`
			});
			process.exit(1);
	}
};

const getInputAndOutputFromArg = () => {
	const { unnormalizedFlags } = cli;
	const inputDir = unnormalizedFlags.target;
	const outputDir = unnormalizedFlags.printTo;

	if (!inputDir) {
		alert({
			type: `error`,
			msg: `Missing required flags: --target! - Command Example: ['npx move2ts extract --target ./source']`
		});
		process.exit(1);
	}

	return {
		input: inputDir,
		output: outputDir
	};
};

const mapMoveTypeToTS = moveType => {
	if (!moveType) return 'any';

	moveType = moveType.trim();

	// Clean up trailing commas/semicolons
	moveType = moveType.replace(/[;,]$/, '');

	// Handle primitive types
	if (/^u\d+$/.test(moveType)) return 'number';
	if (moveType === 'bool') return 'boolean';
	if (moveType === 'address') return 'string';
	if (moveType === 'object') return 'string';
	if (moveType === 'String') return 'string';
	if (moveType === 'UID' || moveType === 'object::ID') return 'string';

	// Handle Option<T>
	if (/^Option<.+>$/.test(moveType)) {
		const inner = moveType.match(/^Option<(.+)>$/)[1].trim();
		return `${mapMoveTypeToTS(inner)} | null`;
	}

	// Handle vector<T>
	if (/^vector<.+>$/.test(moveType)) {
		const inner = moveType.match(/^vector<(.+)>$/)[1].trim();

		// Only map known primitive types inside vector
		if (
			/^u\d+$/.test(inner) ||
			inner === 'bool' ||
			inner === 'address' ||
			inner === 'String' ||
			inner === 'UID' ||
			inner === 'object::ID'
		) {
			return `${mapMoveTypeToTS(inner)}[]`;
		}

		// Otherwise, treat it as a generic or struct name and return directly
		return `${inner}[]`;
	}

	// Handle Balance<T>
	if (/^Balance<.+>$/.test(moveType)) {
		return 'string';
	}

	// Handle VecMap<K, V> or Table<K, V>
	if (/^(VecMap|Table)<.+>$/.test(moveType)) {
		return 'Record<string, any>';
	}

	// Handle object types like CustomStruct<T>
	if (/^\w+<.*>$/.test(moveType)) {
		const [base, _] = moveType.split('<');
		return `${base}<any>`;
	}

	// Fallback
	return 'any';
};

const parseStructs = moveSource => {
	const structRegex =
		/public\s+struct\s+(\w+)(<[^>]+>)?\s*(has\s+[^{]+)?\s*{([\s\S]*?)}/g;
	const matches = [...moveSource.matchAll(structRegex)];

	const result = [];

	for (const match of matches) {
		const name = match[1];
		const genericBlock = match[2] || '';
		const generics = genericBlock
			.replace(/[<>]/g, '')
			.split(',')
			.map(g => g.trim().split(':')[0])
			.filter(Boolean);

		const body = match[4].trim();
		const fields = body
			.split('\n')
			.map(line => line.trim())
			.filter(line => line && line.includes(':'))
			.map(line => {
				const [rawName, rawType] = line
					.replace(/;$/, '')
					.split(':')
					.map(str => str.trim());

				return `  ${rawName}: ${mapMoveTypeToTS(rawType)}`;
			});

		const genericStr = generics.length ? `<${generics.join(', ')}>` : '';
		const interfaceStr = `export interface ${name}${genericStr} {\n${fields.join('\n')}\n}`;
		result.push(interfaceStr);
	}

	return result.join('\n\n');
};

const handleConvertStructToTs = content => {
	const tsOutput = parseStructs(content);
	return tsOutput;
};

const handleGetFileContent = () => {
	const { input, output } = getInputAndOutputFromArg();

	if (!fs.existsSync(input)) {
		alert({ type: `error`, msg: `Input file "${input}" does not exist.` });
		process.exit(1);
	}

	const ext = path.extname(input);
	if (ext !== '.move') {
		alert({
			type: `error`,
			msg: `Only .move files are supported. Found: "${ext}"`
		});
		process.exit(1);
	}
	let rootDir = output
		? path.join(output, 'types')
		: path.join(process.cwd(), 'types');

	if (!fs.existsSync(rootDir)) {
		fs.mkdirSync(rootDir, { recursive: true });
	}

	const content = fs.readFileSync(input, 'utf-8');
	const extractedTypes = handleConvertStructToTs(content);

	const fileName = `${path.parse(input).name}.ts`;
	const fileOut = path.join(rootDir, fileName);

	fs.writeFileSync(fileOut, extractedTypes);

	// Show success message
	const successMessage = `
🎉 Success! Your Move structs have been converted to TypeScript.

📁 Output saved to: ${path.relative(process.cwd(), fileOut)}

💡 Tip: You can now import the generated interfaces into your frontend project.
	`;

	console.log(
		boxen(chalk.green(successMessage), {
			padding: 1,
			margin: 1,
			borderColor: 'green',
			borderStyle: 'round',
			title: 'move2ts',
			titleAlignment: 'center'
		})
	);
};

export default handleCommandRouter;
