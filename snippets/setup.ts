import * as path from "jsr:@std/path";

// Prompt user for HOSTNAME and API_KEY
async function promptInput(prompt: string, required = false): Promise<string> {
	let value = '';
	do {
		value = (promptSync(prompt) ?? '').trim();
		if (required && !value) {
			console.log(`${prompt} is required.`);
		}
	} while (required && !value);
	return value;
}

function promptSync(prompt: string): string | null {
	return prompt ? promptInputSync(prompt) : null;
}

function promptInputSync(question: string): string | null {
	return prompt(question);
}

// Recursively find .env files
async function findEnvFiles(dir: string): Promise<string[]> {
	const envFiles: string[] = [];

	for await (const entry of Deno.readDir(dir)) {
		// const fullPath = `${dir}/${entry.name}`;
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory) {
			const subEnvFiles = await findEnvFiles(fullPath);
			envFiles.push(...subEnvFiles);
		} else if (entry.isFile && entry.name === '.env') {
			envFiles.push(fullPath);
		}
	}

	return envFiles;
}

// Update .env file
async function updateEnvFile(filePath: string, hostname: string, apiKey: string): Promise<void> {
	const text = await Deno.readTextFile(filePath);
	const lines = text.split('\n');

	const updatedLines = lines.map(line => {
		if (line.startsWith('HOSTNAME=')) {
			return `HOSTNAME=${hostname}`;
		} else if (line.startsWith('API_KEY=')) {
			return `API_KEY=${apiKey}`;
		}
		return line;
	});

	await Deno.writeTextFile(filePath, updatedLines.join('\n'));
	console.log(`✔ Updated: ${filePath}`);
}

// Main function
const hostname = await promptInput('Enter device HOSTNAME (required): ', true);
const apiKey = await promptInput('Enter API_KEY (optional): ');

const currentDir = Deno.cwd();
const envFiles = await findEnvFiles(currentDir);

if (envFiles.length === 0) {
	console.log('No .env files found.');
} else {
	for (const filePath of envFiles) {
		await updateEnvFile(filePath, hostname, apiKey);
	}
}
