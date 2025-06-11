#!/usr/bin/env node

const { spawn } = require('child_process');

// Run Storybook dev server
const storybook = spawn('npx', ['storybook', 'dev', '-p', '6006'], {
  stdio: 'inherit',
  shell: true
});

storybook.on('close', (code) => {
  console.log(`Storybook process exited with code ${code}`);
}); 