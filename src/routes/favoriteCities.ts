import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function favoriteCitiesRoutes(app: FastifyInstance) {
    //Adicionar cidades aos favoritos
    app.post("/favoritecity", async (request, reply) => {
        const createFavoriteCitiesBodySchema = z.object({
            name: z.string().min(1),
        })

        const { name } = createFavoriteCitiesBodySchema.parse(request.body)

        const favoriteCity = await prisma.favoriteCity.findFirst({
            where: {
                name
            }
        })

        if (favoriteCity) {
            return reply.status(409).send({ error: 'favorite city already added' })
        }else {
            await prisma.favoriteCity.create({
                data: {
                    name
                }
            })
            return reply.status(201).send()
        }
        
    })
    //Remover cidades dos favoritos
    app.delete('/favoritecity/:id', async (request, reply) => {
        
        const deleteFavoriteCitiesParamsSchema = z.object({
            id: z.coerce.number()
        })
        
        const { id } = deleteFavoriteCitiesParamsSchema.parse(request.params)

        const cityExist = await prisma.favoriteCity.findUnique({
            where: {
                id
            }
        })
        
        if (!cityExist) {
            return reply.status(404).send({ error: 'Favorite city not exist' })
        }

        await prisma.favoriteCity.delete({
            where: {
                id
            }
        })
        

        return reply.status(204).send()
    })
    //Buscar cidades favoritas
    app.get("/favoritecity", async (request, reply) => {

        const favoriteCities = await prisma.favoriteCity.findMany()

        return reply.send({favoriteCities})
    })
}