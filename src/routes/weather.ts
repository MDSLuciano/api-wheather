import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { api } from '../lib/axios'

export async function weatherRoutes(app: FastifyInstance) {
	//Buscar tempo por cidade
    app.get("/weather/:cityName", async (request, reply) => {
        const getNextDaysWeatherParamsSchema = z.object({
            cityName: z.string().min(1),
        })

        const { cityName } = getNextDaysWeatherParamsSchema.parse(request.params)

        const response = await api.get("", {
            params: {
                q: cityName,
            }
        });

        return reply.send(response.data)
    })
    //Buscar previsões para 3 dias
    app.get("/weather/nextdays/:cityName", async (request, reply) => {
        const getNextDaysWeatherParamsSchema = z.object({
            cityName: z.string().min(1),
        })

        const { cityName } = getNextDaysWeatherParamsSchema.parse(request.params)

        const response = await api.get("", {
            params: {
                q: cityName,
                days: 3
            }
        });

        return reply.send(response.data)
    })
}