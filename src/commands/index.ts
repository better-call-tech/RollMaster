import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Command from '../templates/command.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const commands: Record<string, Command> = {}

const commandFiles = readdirSync(__dirname).filter(file => 
    (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.ts' && file !== 'index.js'
)

for (const file of commandFiles) {
    const commandModule = await import(join(__dirname, file))
    const command = commandModule.default

    if (command instanceof Command && command.data && command.data.name) {
        commands[command.data.name] = command
    } else {
        console.warn(`Warning: ${file} does not export a valid Command object`)
    }
}
