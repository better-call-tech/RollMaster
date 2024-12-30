import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Modal from '../templates/modal.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const modals: Record<string, Modal> = {}

const modalFiles = readdirSync(__dirname).filter(file => 
    (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.ts' && file !== 'index.js'
)

for (const file of modalFiles) {
    const modalModule = await import(join(__dirname, file))
    const modal = modalModule.default

    if (modal instanceof Modal && modal.customId) {
        modals[modal.customId] = modal
    } else {
        console.warn(`Warning: ${file} does not export a valid Modal object`)
    }
}
