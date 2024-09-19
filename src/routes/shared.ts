import express, { Request, Response } from 'express'
import { Login } from '../zod/sharedSchema'
import { AccessTokenKey, ApiKey } from '../config'
import jwt from 'jsonwebtoken'
import { authenticateToken } from '../functions'

const app = express.Router()

app.get('/login', (req: Request, res: Response) => {
    const { success } = Login.safeParse(req.body)

    if(success){
        if(req.body.key === ApiKey){
            if(AccessTokenKey){
                const { uname } = req.body
                const user = { name: uname }

                const accessToken = jwt.sign(user, AccessTokenKey)
                
                res.status(200).send({ accessToken })
            }
            else res.status(500).send({ success: false })
        }
        else res.status(403).send({ success: false })
    }
    else res.status(401).send({ success })
})

app.get('/validate', authenticateToken, (req: Request, res: Response) => {

    console.log(req.body);
    
    res.send({ status: 'ok', ...req.body })
})


module.exports = app