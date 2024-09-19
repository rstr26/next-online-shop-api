import { Request, Response } from 'express'
import { AccessTokenKey } from './config'
import jwt from 'jsonwebtoken'

export function authenticateToken(req: Request, res: Response, next: () => void){
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    
    if(AccessTokenKey){
        if(token){
            jwt.verify(token, AccessTokenKey, (err, user) => {
                if(err) return res.sendStatus(403)
                req.body = {...req.body, user}
                
                next()
            })
        }
        else res.sendStatus(401)
    }
    else res.sendStatus(500)
}