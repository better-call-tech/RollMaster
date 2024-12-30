import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Button from '../templates/button.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const buttons: Record<string, Button> = {}

const buttonFiles = readdirSync(__dirname).filter(file => 
    (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.ts' && file !== 'index.js'
)

for (const file of buttonFiles) {
    const buttonModule = await import(join(__dirname, file))
    const button = buttonModule.default

    if (button instanceof Button && button.customId) {
        buttons[button.customId] = button
    } else {
        console.warn(`Warning: ${file} does not export a valid Button object`)
    }
}
