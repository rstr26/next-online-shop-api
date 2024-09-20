import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { User } from './zod/sharedSchema'
import { CorsOrigins } from './config'

const app = express()
const port = 3001
const parser = require('body-parser')
const cors = require('cors')

app.use(cors({ origin: CorsOrigins(process.env.ENVIRONMENT || 'DEVELOPMENT') }), parser())

app.use('/api/shared', require('./routes/shared'))

app.get('/', (req: Request, res: Response) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Shopinas API</title>
            </head>
            <body>
                <h1>Shopinas API</h1>
            </body>
        </html>    
    `)
})

app.get('/validate', (req: Request, res: Response) => {
    const result = User.safeParse(req.body)

    console.log(result);
    
    res.send({ status: result })
    
})

app.listen(port, () => console.log(`Shopinas API listening to port ${port}...`))