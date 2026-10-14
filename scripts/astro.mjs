import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const child = spawn(process.execPath, [
  fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url)),
  ...process.argv.slice(2),
], {
  stdio: 'inherit',
  windowsHide: true,
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});

child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
