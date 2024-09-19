import express, { Request, Response } from 'express'
import { User } from './zod/sharedSchema'
import dotenv from 'dotenv'

const app = express()
const port = 3001
const cors = require('cors')
const parser = require('body-parser')
dotenv.config()

app.use(cors(), parser())

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