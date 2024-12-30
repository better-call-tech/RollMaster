import { prisma } from '../prisma/prismaClient.ts'

export const findUserByDiscordId = async (discordId: string) => {
    return prisma.user.findUnique({
        where: { discordId }
    })
}

export const createUser = async (discordId: string, username: string) => {
    return prisma.user.create({
        data: {
            discordId,
            username
        }
    })
}

