import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import SelectMenu from '../templates/selectMenu.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const selectMenus: Record<string, SelectMenu<any>> = {}

const selectMenuFiles = readdirSync(__dirname).filter(file => 
    (file.endsWith('.js') || file.endsWith('.ts')) && file !== 'index.ts' && file !== 'index.js'
)

for (const file of selectMenuFiles) {
    const selectMenuModule = await import(join(__dirname, file))
    const selectMenu = selectMenuModule.default

    if (selectMenu instanceof SelectMenu && selectMenu.customId) {
        selectMenus[selectMenu.customId] = selectMenu
    } else {
        console.warn(`Warning: ${file} does not export a valid SelectMenu object`)
    }
}