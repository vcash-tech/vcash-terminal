#!/usr/bin/env ts-node

import { spawn } from 'child_process'

// Build Storybook for production
const buildStorybook = spawn('npx', ['storybook', 'build'], {
  stdio: 'inherit',
  shell: true
})

buildStorybook.on('close', (code) => {
  console.log(`Storybook build process exited with code ${code}`)
}) 