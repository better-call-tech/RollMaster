import { prisma } from '../prisma/prismaClient.js'

export const getConfig = async (key: string): Promise<string | null> => {
    const config = await prisma.config.findUnique({
        where: { key }
    })
    return config?.value ?? null
}

export const setConfig = async (key: string, value: string): Promise<void> => {
    await prisma.config.upsert({
        where: { key },
        update: { value },
        create: { key, value }
    })
} 