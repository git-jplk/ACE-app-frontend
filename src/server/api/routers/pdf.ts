// src/server/routers/pdf.ts
import { z } from 'zod'
import pdf from 'pdf-parse'
import { createTRPCRouter, publicProcedure } from '../trpc'
export const pdfRouter = createTRPCRouter({
    extract: publicProcedure
        .input(z.object({ base64: z.string() }))
        .mutation(async ({ input }) => {
            const buffer = Buffer.from(input.base64, 'base64')
            const data = await pdf(buffer)
            return { text: data.text }
        }),
})
