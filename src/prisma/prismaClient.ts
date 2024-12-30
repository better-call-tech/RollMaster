import { PrismaClient } from '@prisma/client'

// Create and export the Prisma client instance
export const prisma = new PrismaClient({
    log: ['info', 'warn', 'error']
})

// Optional: Log Prisma queries (useful in development)
prisma.$use(async (params, next) => {
    console.log(`Query: ${params.model}.${params.action}`)
    return next(params)
})
