import express, { Request, Response } from 'express'
import { Login } from '../zod/sharedSchema'
import { AccessTokenKey, ApiKey, DecryptionKey, UnauthorizedMsg, XValidationMsg } from '../config'
import jwt from 'jsonwebtoken'
import { authenticateToken, decryptStr } from '../functions'

const app = express.Router()

app.post('/login', (req: Request, res: Response) => {
    const { success } = Login.safeParse(req.body)
    
    if(success){
        const { key, uname, pword, brandcode } = req.body
        
        if(key === ApiKey){            
            if(AccessTokenKey && DecryptionKey){
                const user = { name: uname }

                const accessToken = jwt.sign(user, AccessTokenKey)
                
                res.status(200).send({ success: true, accessToken })
            }
            else res.status(500).send({ success: false })
        }
        else res.status(403).send(XValidationMsg)
    }
    else res.status(401).send(UnauthorizedMsg)
})

app.get('/validate', authenticateToken, (req: Request, res: Response) => {

    console.log(req.body);
    
    res.send({ status: 'ok', ...req.body })
})


module.exports = app