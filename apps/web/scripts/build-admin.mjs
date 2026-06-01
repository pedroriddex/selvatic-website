import { cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(scriptDir, '..');
const repoRoot = resolve(webDir, '..', '..');
const cmsDir = resolve(repoRoot, 'apps', 'cms');
const cmsDistDir = resolve(cmsDir, 'dist');
const adminOutputDir = resolve(webDir, 'static', 'admin');
const rootStaticAssetsDir = resolve(webDir, 'static', 'static');
const rootUploadsDir = resolve(webDir, 'static', 'uploads');
const sanityBinary = resolve(
	cmsDir,
	'node_modules',
	'.bin',
	process.platform === 'win32' ? 'sanity.cmd' : 'sanity'
);
const npmCommand = process.env.npm_execpath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmArgs = process.env.npm_execpath
	? [process.env.npm_execpath, 'install', '--no-fund', '--no-audit']
	: ['install', '--no-fund', '--no-audit'];

const ensureEnv = (name, fallback) => {
	if (!process.env[name] && fallback) {
		process.env[name] = fallback;
	}
};

ensureEnv(
	'SANITY_STUDIO_PROJECT_ID',
	process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || ''
);
ensureEnv(
	'SANITY_STUDIO_DATASET',
	process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production'
);
ensureEnv('SANITY_STUDIO_TITLE', process.env.SANITY_STUDIO_TITLE || 'Selvatic CMS');
ensureEnv('SANITY_STUDIO_BASEPATH', '/admin');

const run = (command, args, options = {}) =>
	new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(command, args, {
			stdio: 'inherit',
			...options
		});

		child.on('exit', (code) => {
			if (code === 0) {
				resolvePromise();
				return;
			}

			rejectPromise(new Error(`Command failed: ${command} ${args.join(' ')} (${code ?? 'unknown'})`));
		});

		child.on('error', rejectPromise);
	});

if (!existsSync(sanityBinary)) {
	await run(npmCommand, npmArgs, {
		cwd: cmsDir,
		env: process.env
	});
}

await rm(adminOutputDir, { recursive: true, force: true });
await rm(rootStaticAssetsDir, { recursive: true, force: true });
await rm(rootUploadsDir, { recursive: true, force: true });
await run(sanityBinary, ['build', '--yes'], {
	cwd: cmsDir,
	env: process.env
});
await cp(cmsDistDir, adminOutputDir, { recursive: true });
await cp(resolve(cmsDistDir, 'static'), rootStaticAssetsDir, { recursive: true });
await cp(resolve(cmsDistDir, 'uploads'), rootUploadsDir, { recursive: true });
