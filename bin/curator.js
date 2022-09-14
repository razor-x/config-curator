#!/usr/bin/env node

import path from 'path'

import curator from '../lib/index.js'

const manifestPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(process.cwd(), 'manifest.js')

const manifest = await import(manifestPath)

await curator(manifest.default)
