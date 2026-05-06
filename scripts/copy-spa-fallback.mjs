import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const index = join(process.cwd(), 'dist', 'index.html')
const fallback = join(process.cwd(), 'dist', '404.html')

if (existsSync(index)) {
  copyFileSync(index, fallback)
  console.log('copy-spa-fallback: dist/index.html -> dist/404.html')
}
